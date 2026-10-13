const Case = require("../models/Case");
const WorkflowEvent = require("../models/WorkflowEvent");
const { getWorkflowBottleneckThresholds } = require("../config/workflowBottleneckThresholds");

const TERMINAL_CASE_STATUSES = ["COMPLETED", "REPORTED"];

const eventTime = (event) => {
  const value = event.createdAt ? new Date(event.createdAt).getTime() : NaN;
  return Number.isFinite(value) ? value : null;
};

const formatStageName = (stage) => stage
  .toLowerCase()
  .split("_")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const analyzeWorkflowBottlenecks = ({
  cases,
  events,
  now = new Date(),
  thresholds = getWorkflowBottleneckThresholds(),
}) => {
  const nowDate = new Date(now);
  if (!Number.isFinite(nowDate.getTime())) {
    throw new TypeError("A valid analysis time is required");
  }

  const caseById = new Map(cases.map((caseData) => [String(caseData._id), caseData]));
  const eventsByCase = new Map();

  for (const event of events) {
    const caseId = String(event.case?._id || event.case);
    if (!eventsByCase.has(caseId)) eventsByCase.set(caseId, []);
    eventsByCase.get(caseId).push(event);
  }

  const delayedByStage = new Map();
  let unmeasurableCaseCount = 0;

  for (const [caseObjectId, caseData] of caseById) {
    const caseEvents = eventsByCase.get(caseObjectId) || [];
    if (caseEvents.length === 0) continue;

    const timestampedEvents = caseEvents.map((event) => ({
      event,
      timestamp: eventTime(event),
    }));

    // If an event timestamp is missing, the current stage cannot be established
    // reliably from this event history, so this case is not flagged.
    if (timestampedEvents.some(({ timestamp }) => timestamp === null)) {
      unmeasurableCaseCount += 1;
      continue;
    }

    timestampedEvents.sort((left, right) => left.timestamp - right.timestamp);
    const latest = timestampedEvents[timestampedEvents.length - 1];
    const { event } = latest;

    if (event.status !== "STARTED") continue;

    const thresholdMinutes = thresholds[event.stage];
    if (!Number.isInteger(thresholdMinutes) || thresholdMinutes <= 0) {
      unmeasurableCaseCount += 1;
      continue;
    }

    const elapsedMilliseconds = nowDate.getTime() - latest.timestamp;
    if (elapsedMilliseconds < 0) {
      unmeasurableCaseCount += 1;
      continue;
    }

    const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000);
    if (elapsedMinutes <= thresholdMinutes) continue;

    if (!delayedByStage.has(event.stage)) {
      delayedByStage.set(event.stage, []);
    }

    delayedByStage.get(event.stage).push({
      caseId: caseData.caseId,
      caseStatus: caseData.status,
      priority: caseData.priority,
      startedAt: new Date(latest.timestamp).toISOString(),
      elapsedMinutes,
      thresholdMinutes,
      reason: `${formatStageName(event.stage)} has remained in progress for ${elapsedMinutes} minutes, exceeding its ${thresholdMinutes}-minute configured threshold.`,
    });
  }

  const stages = Object.entries(thresholds)
    .filter(([stage]) => delayedByStage.has(stage))
    .map(([stage, thresholdMinutes]) => {
      const delayedCases = delayedByStage.get(stage).sort(
        (left, right) => right.elapsedMinutes - left.elapsedMinutes
      );
      return {
        stage,
        thresholdMinutes,
        delayedCaseCount: delayedCases.length,
        delayedCases,
      };
    });

  return {
    generatedAt: nowDate.toISOString(),
    method: "Rules-based comparison of the latest STARTED workflow event with configured stage thresholds.",
    delayedCaseCount: stages.reduce((total, stage) => total + stage.delayedCaseCount, 0),
    unmeasurableCaseCount,
    stages,
  };
};

const getWorkflowBottlenecks = async ({ now = new Date() } = {}) => {
  const cases = await Case.find({
    status: { $nin: TERMINAL_CASE_STATUSES },
  })
    .select("_id caseId status priority")
    .lean();

  if (!cases.length) {
    return analyzeWorkflowBottlenecks({
      cases,
      events: [],
      now,
    });
  }

  const events = await WorkflowEvent.find({
    case: { $in: cases.map((caseData) => caseData._id) },
  })
    .select("case stage status createdAt")
    .sort({ createdAt: 1 })
    .lean();

  return analyzeWorkflowBottlenecks({ cases, events, now });
};

module.exports = {
  TERMINAL_CASE_STATUSES,
  analyzeWorkflowBottlenecks,
  getWorkflowBottlenecks,
};
