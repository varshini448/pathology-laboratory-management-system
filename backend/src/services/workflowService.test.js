const assert = require("node:assert/strict");
const { afterEach, beforeEach, test } = require("node:test");

const Case = require("../models/Case");
const Specimen = require("../models/Specimen");
const Block = require("../models/Block");
const Slide = require("../models/Slide");
const WorkflowEvent = require("../models/WorkflowEvent");
const { createWorkflowEvent } = require("./workflowService");

const originalMethods = {
  caseFindById: Case.findById,
  caseFindByIdAndUpdate: Case.findByIdAndUpdate,
  specimenFindById: Specimen.findById,
  specimenFindByIdAndUpdate: Specimen.findByIdAndUpdate,
  blockFindById: Block.findById,
  blockFindByIdAndUpdate: Block.findByIdAndUpdate,
  slideFindById: Slide.findById,
  slideFindByIdAndUpdate: Slide.findByIdAndUpdate,
  workflowEventCreate: WorkflowEvent.create,
};

let reads;
let updates;
let persistedEvents;
let relatedCaseId;

beforeEach(() => {
  reads = [];
  updates = [];
  persistedEvents = [];
  relatedCaseId = "case-1";

  Case.findById = async (id) => {
    reads.push({ model: "Case", id });
    return { _id: id };
  };
  Case.findByIdAndUpdate = async (id, update) => {
    updates.push({ model: "Case", id, update });
    return { _id: id, ...update };
  };
  Specimen.findById = async (id) => {
    reads.push({ model: "Specimen", id });
    return { _id: id, case: relatedCaseId, status: "RECEIVED" };
  };
  Specimen.findByIdAndUpdate = async (id, update) => {
    updates.push({ model: "Specimen", id, update });
    return { _id: id, ...update };
  };
  Block.findById = async (id) => {
    reads.push({ model: "Block", id });
    return { _id: id, case: relatedCaseId, processingStatus: "CREATED" };
  };
  Block.findByIdAndUpdate = async (id, update) => {
    updates.push({ model: "Block", id, update });
    return { _id: id, ...update };
  };
  Slide.findById = async (id) => {
    reads.push({ model: "Slide", id });
    return { _id: id, case: relatedCaseId, status: "STAINED" };
  };
  Slide.findByIdAndUpdate = async (id, update) => {
    updates.push({ model: "Slide", id, update });
    return { _id: id, ...update };
  };
  WorkflowEvent.create = async (event) => {
    const persistedEvent = { _id: `event-${persistedEvents.length + 1}`, ...event };
    persistedEvents.push(persistedEvent);
    return persistedEvent;
  };
});

afterEach(() => {
  Case.findById = originalMethods.caseFindById;
  Case.findByIdAndUpdate = originalMethods.caseFindByIdAndUpdate;
  Specimen.findById = originalMethods.specimenFindById;
  Specimen.findByIdAndUpdate = originalMethods.specimenFindByIdAndUpdate;
  Block.findById = originalMethods.blockFindById;
  Block.findByIdAndUpdate = originalMethods.blockFindByIdAndUpdate;
  Slide.findById = originalMethods.slideFindById;
  Slide.findByIdAndUpdate = originalMethods.slideFindByIdAndUpdate;
  WorkflowEvent.create = originalMethods.workflowEventCreate;
});

const baseData = {
  case: "case-1",
  performedBy: "user-1",
};

test("specimen collection STARTED verifies the specimen without changing its status and persists the event", async () => {
  const result = await createWorkflowEvent({
    ...baseData,
    specimen: "specimen-1",
    stage: "SPECIMEN_COLLECTION",
    status: "STARTED",
  });

  assert.deepEqual(reads, [
    { model: "Case", id: "case-1" },
    { model: "Specimen", id: "specimen-1" },
  ]);
  assert.deepEqual(updates, []);
  assert.equal(persistedEvents.length, 1);
  assert.equal(result.status, "STARTED");
  assert.equal(result.specimen, "specimen-1");
});

test("specimen collection COMPLETED sets COLLECTED, advances the case, and persists the event", async () => {
  const result = await createWorkflowEvent({
    ...baseData,
    specimen: "specimen-1",
    stage: "SPECIMEN_COLLECTION",
    status: "COMPLETED",
  });

  assert.deepEqual(updates, [
    { model: "Specimen", id: "specimen-1", update: { status: "COLLECTED" } },
    { model: "Case", id: "case-1", update: { status: "SPECIMEN_COLLECTED" } },
  ]);
  assert.equal(persistedEvents.length, 1);
  assert.equal(result.status, "COMPLETED");
});

test("scanning STARTED verifies the slide without changing its status and persists the event", async () => {
  const result = await createWorkflowEvent({
    ...baseData,
    slide: "slide-1",
    stage: "SCANNING",
    status: "STARTED",
  });

  assert.deepEqual(reads, [
    { model: "Case", id: "case-1" },
    { model: "Slide", id: "slide-1" },
  ]);
  assert.deepEqual(updates, [
    { model: "Case", id: "case-1", update: { status: "IN_PROCESS" } },
  ]);
  assert.equal(persistedEvents.length, 1);
  assert.equal(result.status, "STARTED");
  assert.equal(result.slide, "slide-1");
});

test("scanning COMPLETED sets SCANNED and persists the event", async () => {
  const result = await createWorkflowEvent({
    ...baseData,
    slide: "slide-1",
    stage: "SCANNING",
    status: "COMPLETED",
  });

  assert.deepEqual(updates, [
    { model: "Slide", id: "slide-1", update: { status: "SCANNED" } },
    { model: "Case", id: "case-1", update: { status: "IN_PROCESS" } },
  ]);
  assert.equal(persistedEvents.length, 1);
  assert.equal(result.status, "COMPLETED");
});

test("rejects an invalid non-empty status before reading or updating records", async () => {
  await assert.rejects(
    createWorkflowEvent({
      ...baseData,
      slide: "slide-1",
      stage: "SCANNING",
      status: "PAUSED",
    }),
    { message: "Workflow status must be STARTED or COMPLETED" }
  );

  assert.deepEqual(reads, []);
  assert.deepEqual(updates, []);
  assert.deepEqual(persistedEvents, []);
});

test("rejects workflow events for an entity associated with another case before updates", async () => {
  relatedCaseId = "case-2";

  await assert.rejects(
    createWorkflowEvent({
      ...baseData,
      specimen: "specimen-1",
      stage: "SPECIMEN_COLLECTION",
      status: "COMPLETED",
    }),
    { message: "Specimen does not belong to this case", statusCode: 400 }
  );

  assert.deepEqual(updates, []);
  assert.deepEqual(persistedEvents, []);
});

test("preserves existing transitions for other workflow stages", async () => {
  const cases = [
    ["ACCESSIONING", "STARTED", "Specimen", "RECEIVED", "specimen"],
    ["ACCESSIONING", "COMPLETED", "Specimen", "ACCESSIONED", "specimen"],
    ["GROSSING", "STARTED", "Block", "GROSSING", "block"],
    ["GROSSING", "COMPLETED", "Block", "EMBEDDING", "block"],
    ["EMBEDDING", "STARTED", "Block", "EMBEDDING", "block"],
    ["EMBEDDING", "COMPLETED", "Block", "SECTIONING", "block"],
    ["SECTIONING", "STARTED", "Block", "SECTIONING", "block"],
    ["SECTIONING", "COMPLETED", "Block", "COMPLETED", "block"],
    ["STAINING", "STARTED", "Slide", "STAINING", "slide"],
    ["STAINING", "COMPLETED", "Slide", "STAINED", "slide"],
    ["PATHOLOGIST_REVIEW", "STARTED", "Slide", "UNDER_REVIEW", "slide"],
    ["PATHOLOGIST_REVIEW", "COMPLETED", "Slide", "COMPLETED", "slide"],
  ];

  for (const [stage, status, model, expectedStatus, entityKey] of cases) {
    updates = [];
    persistedEvents = [];
    const entityId = `${entityKey}-1`;

    const result = await createWorkflowEvent({
      ...baseData,
      [entityKey]: entityId,
      stage,
      status,
    });

    const entityUpdate = updates.find((update) => update.model === model);
    assert.deepEqual(entityUpdate.update, {
      [model === "Block" ? "processingStatus" : "status"]: expectedStatus,
    }, `${stage} ${status} keeps its existing entity transition`);
    assert.equal(result.stage, stage);
    assert.equal(result.status, status);
    assert.equal(persistedEvents.length, 1);

    const caseUpdate = updates.find((update) => update.model === "Case");
    if (stage === "PATHOLOGIST_REVIEW") {
      assert.equal(caseUpdate.update.status, status === "COMPLETED" ? "COMPLETED" : "IN_PROCESS");
    } else {
      assert.equal(caseUpdate.update.status, "IN_PROCESS");
    }
  }
});
