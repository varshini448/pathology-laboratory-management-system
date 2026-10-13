const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");

const Case = require("../models/Case");
const WorkflowEvent = require("../models/WorkflowEvent");
const {
  DEFAULT_THRESHOLDS_MINUTES,
  getWorkflowBottleneckThresholds,
} = require("../config/workflowBottleneckThresholds");
const {
  analyzeWorkflowBottlenecks,
  getWorkflowBottlenecks,
} = require("./workflowBottleneckService");

const originalCaseFind = Case.find;
const originalWorkflowEventFind = WorkflowEvent.find;
const now = new Date("2026-10-12T04:00:00.000Z");
const thresholds = { ...DEFAULT_THRESHOLDS_MINUTES, SPECIMEN_COLLECTION: 60 };

afterEach(() => {
  Case.find = originalCaseFind;
  WorkflowEvent.find = originalWorkflowEventFind;
});

const caseRecord = (id, caseId = id) => ({
  _id: id,
  caseId,
  status: "IN_PROCESS",
  priority: "NORMAL",
});

const eventRecord = (caseId, stage, status, createdAt) => ({
  case: caseId,
  stage,
  status,
  createdAt,
});

test("configured thresholds accept positive integer overrides and ignore invalid values", () => {
  const config = getWorkflowBottleneckThresholds({
    WORKFLOW_BOTTLENECK_SPECIMEN_COLLECTION_MINUTES: "45",
    WORKFLOW_BOTTLENECK_GROSSING_MINUTES: "0",
    WORKFLOW_BOTTLENECK_SCANNING_MINUTES: "not-a-number",
  });

  assert.equal(config.SPECIMEN_COLLECTION, 45);
  assert.equal(config.GROSSING, DEFAULT_THRESHOLDS_MINUTES.GROSSING);
  assert.equal(config.SCANNING, DEFAULT_THRESHOLDS_MINUTES.SCANNING);
});

test("normal in-progress and completed stages are not flagged", () => {
  const result = analyzeWorkflowBottlenecks({
    cases: [caseRecord("case-1"), caseRecord("case-2")],
    events: [
      eventRecord("case-1", "SPECIMEN_COLLECTION", "STARTED", new Date(now - 30 * 60000)),
      eventRecord("case-2", "SPECIMEN_COLLECTION", "STARTED", new Date(now - 120 * 60000)),
      eventRecord("case-2", "SPECIMEN_COLLECTION", "COMPLETED", new Date(now - 90 * 60000)),
    ],
    now,
    thresholds,
  });

  assert.equal(result.delayedCaseCount, 0);
  assert.deepEqual(result.stages, []);
  assert.equal(result.unmeasurableCaseCount, 0);
});

test("groups delayed cases by stage with measured elapsed time, threshold, and reason", () => {
  const result = analyzeWorkflowBottlenecks({
    cases: [caseRecord("case-1", "CASE-101"), caseRecord("case-2", "CASE-102")],
    events: [
      eventRecord("case-1", "SPECIMEN_COLLECTION", "STARTED", new Date(now - 90 * 60000)),
      eventRecord("case-2", "SPECIMEN_COLLECTION", "STARTED", new Date(now - 150 * 60000)),
    ],
    now,
    thresholds,
  });

  assert.equal(result.delayedCaseCount, 2);
  assert.equal(result.stages.length, 1);
  assert.equal(result.stages[0].stage, "SPECIMEN_COLLECTION");
  assert.equal(result.stages[0].delayedCaseCount, 2);
  assert.equal(result.stages[0].thresholdMinutes, 60);
  assert.deepEqual(result.stages[0].delayedCases.map((item) => item.elapsedMinutes), [150, 90]);
  assert.equal(result.stages[0].delayedCases[0].caseId, "CASE-102");
  assert.match(result.stages[0].delayedCases[0].reason, /150 minutes.*60-minute configured threshold/i);
  assert.equal(result.stages[0].delayedCases[0].startedAt, "2026-10-12T01:30:00.000Z");
});

test("cases with missing event timestamps are reported as unmeasurable, not delayed", () => {
  const result = analyzeWorkflowBottlenecks({
    cases: [caseRecord("case-1")],
    events: [eventRecord("case-1", "SPECIMEN_COLLECTION", "STARTED", null)],
    now,
    thresholds,
  });

  assert.equal(result.delayedCaseCount, 0);
  assert.equal(result.unmeasurableCaseCount, 1);
  assert.deepEqual(result.stages, []);
});

test("empty open-case results do not query workflow events", async () => {
  let eventQueryCalled = false;
  Case.find = (query) => {
    assert.deepEqual(query, { status: { $nin: ["COMPLETED", "REPORTED"] } });
    return { select: () => ({ lean: async () => [] }) };
  };
  WorkflowEvent.find = () => {
    eventQueryCalled = true;
    throw new Error("No events should be queried");
  };

  const result = await getWorkflowBottlenecks({ now });
  assert.equal(eventQueryCalled, false);
  assert.equal(result.delayedCaseCount, 0);
  assert.deepEqual(result.stages, []);
});

test("database errors propagate to the controller for safe unavailable handling", async () => {
  Case.find = () => { throw new Error("internal database detail"); };

  await assert.rejects(getWorkflowBottlenecks({ now }), /internal database detail/);
});

test("cases whose newest workflow timestamp is in the future are unmeasurable", () => {
  const result = analyzeWorkflowBottlenecks({
    cases: [caseRecord("case-1")],
    events: [eventRecord("case-1", "SPECIMEN_COLLECTION", "STARTED", new Date(now.getTime() + 60000))],
    now,
    thresholds,
  });

  assert.equal(result.unmeasurableCaseCount, 1);
  assert.equal(result.delayedCaseCount, 0);
});
