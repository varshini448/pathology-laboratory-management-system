const Case = require("../models/Case");
const WorkflowEvent = require("../models/WorkflowEvent");
const Report = require("../models/Report");

// TAT target values for this project.
// These are project/demo configuration values, not clinical standards.
const TAT_TARGETS = {
  NORMAL: 72 * 60,
  URGENT: 48 * 60,
  STAT: 24 * 60,
};

const getDurationInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return null;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  return Math.round((end - start) / (1000 * 60));
};

const getTATTarget = (priority) => {
  return TAT_TARGETS[priority] || TAT_TARGETS.NORMAL;
};

const getTATStatus = (tatMinutes, targetMinutes, isCompleted) => {
  if (tatMinutes === null || tatMinutes === undefined) {
    return "IN_PROGRESS";
  }

  if (!isCompleted) {
    if (tatMinutes > targetMinutes) {
      return "DELAYED";
    }

    return "IN_PROGRESS";
  }

  if (tatMinutes > targetMinutes) {
    return "DELAYED";
  }

  return "WITHIN_TAT";
};

const buildTATData = ({
  caseData,
  startTime,
  endTime,
  isCompleted,
}) => {
  const tatMinutes = getDurationInMinutes(startTime, endTime);

  const targetMinutes = getTATTarget(caseData.priority);

  const tatStatus = getTATStatus(
    tatMinutes,
    targetMinutes,
    isCompleted
  );

  return {
    caseId: caseData.caseId,
    patient: caseData.patient,
    doctor: caseData.doctor,
    priority: caseData.priority,
    caseStatus: caseData.status,
    startTime,
    endTime,
    tatMinutes,
    targetMinutes,
    isCompleted,
    tatStatus,
  };
};

const getCaseTAT = async (caseId) => {
  const caseData = await Case.findOne({ caseId })
    .populate("patient")
    .populate("doctor");

  if (!caseData) {
    throw new Error("Case not found");
  }

  const report = await Report.findOne({
    case: caseData._id,
  });

  const startTime = caseData.createdAt;

  let endTime = null;
  let isCompleted = false;

  if (report && report.reviewedAt) {
    endTime = report.reviewedAt;
    isCompleted = true;
  } else {
    endTime = new Date();
  }

  return buildTATData({
    caseData,
    startTime,
    endTime,
    isCompleted,
  });
};

const getAllCaseTAT = async () => {
  const cases = await Case.find()
    .populate("patient")
    .populate("doctor")
    .sort({ createdAt: -1 });

  const reports = await Report.find({
    case: { $in: cases.map((caseData) => caseData._id) },
  });

  const reportMap = new Map();

  reports.forEach((report) => {
    reportMap.set(report.case.toString(), report);
  });

  return cases.map((caseData) => {
    const report = reportMap.get(caseData._id.toString());

    const startTime = caseData.createdAt;

    let endTime = null;
    let isCompleted = false;

    if (report && report.reviewedAt) {
      endTime = report.reviewedAt;
      isCompleted = true;
    } else {
      endTime = new Date();
    }

    return buildTATData({
      caseData,
      startTime,
      endTime,
      isCompleted,
    });
  });
};

const getStageTAT = async (caseId) => {
  const caseData = await Case.findOne({ caseId });

  if (!caseData) {
    throw new Error("Case not found");
  }

  const workflowEvents = await WorkflowEvent.find({
    case: caseData._id,
  }).sort({ createdAt: 1 });

  const stageMap = new Map();

  workflowEvents.forEach((event) => {
    if (!stageMap.has(event.stage)) {
      stageMap.set(event.stage, {
        stage: event.stage,
        startedAt: null,
        completedAt: null,
      });
    }

    const stageData = stageMap.get(event.stage);

    if (event.status === "STARTED") {
      stageData.startedAt = event.createdAt;
    }

    if (event.status === "COMPLETED") {
      stageData.completedAt = event.createdAt;
    }
  });

  return Array.from(stageMap.values()).map((stageData) => ({
    ...stageData,
    durationMinutes: getDurationInMinutes(
      stageData.startedAt,
      stageData.completedAt
    ),
  }));
};

module.exports = {
  getCaseTAT,
  getAllCaseTAT,
  getStageTAT,
};