const QCRecord = require("../models/QCRecord");
const Case = require("../models/Case");
const Slide = require("../models/Slide");
const { createAuditEntry, notifyRolesWithoutBlocking } = require("../services/lifecycleEventService");

const getQCError = (error) => {
  if (error.code === 11000) return { status: 409, message: "A QC record with this identifier already exists." };
  if (["ValidationError", "CastError"].includes(error.name)) return { status: 400, message: "QC record information is invalid." };
  return { status: 500, message: "Unable to complete the QC request." };
};

const createQCRecord = async (req, res) => {
  try {
    const { case: caseId, slide: slideId, qcId, sectionQuality, stainingQuality, labelingCheck, documentationCheck, overallStatus, findings, correctiveAction } = req.body;
    const [caseData, slide] = await Promise.all([
      Case.findById(caseId).select("_id"),
      Slide.findById(slideId).select("_id case"),
    ]);
    if (!caseData || !slide) return res.status(404).json({ message: !caseData ? "Case not found" : "Slide not found" });
    if (String(slide.case?._id || slide.case) !== String(caseData._id)) {
      return res.status(400).json({ message: "Slide does not belong to this case" });
    }
    const qcRecord = await QCRecord.create({
      qcId, case: caseId, slide: slideId, sectionQuality, stainingQuality,
      labelingCheck, documentationCheck, overallStatus, findings, correctiveAction,
      reviewedBy: req.user.id,
    });

    await createAuditEntry({
      req, action: "CREATE", module: "Quality Control", resourceType: "QCRecord", resourceId: qcRecord._id,
      description: "Quality control decision recorded",
      newData: { qcId: qcRecord.qcId, case: String(qcRecord.case), slide: String(qcRecord.slide), overallStatus: qcRecord.overallStatus },
    });
    if (["FAILED", "NEEDS_REVIEW"].includes(qcRecord.overallStatus)) {
      await notifyRolesWithoutBlocking({
        roles: ["QUALITY_MANAGER"],
        eventKey: `qc-decision:${qcRecord._id}:${qcRecord.overallStatus}`,
        title: "Quality control requires attention",
        message: "A quality control decision requires review in the laboratory workspace.",
        type: "QC_ALERT",
        priority: qcRecord.overallStatus === "FAILED" ? "HIGH" : "MEDIUM",
        module: "Quality Control",
        resourceType: "QCRecord",
        resourceId: qcRecord._id,
        actionUrl: "/quality-dashboard",
      });
    }

    const populatedQCRecord = await QCRecord.findById(qcRecord._id)
      .populate("case", "caseId caseType priority status")
      .populate("slide", "slideId slideType stainingMethod status")
      .populate("reviewedBy", "name email role");

    res.status(201).json({
      message: "QC record created successfully",
      qcRecord: populatedQCRecord,
    });
  } catch (error) {
    const response = getQCError(error);
    return res.status(response.status).json({ message: response.message });
  }
};

const getQCRecords = async (req, res) => {
  try {
    const qcRecords = await QCRecord.find()
      .populate("case", "caseId caseType priority status")
      .populate("slide", "slideId slideType stainingMethod status")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      qcRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch QC records",
    });
  }
};

const getQCRecordsByCase = async (req, res) => {
  try {
    const qcRecords = await QCRecord.find({
      case: req.params.caseId,
    })
      .populate("case", "caseId caseType priority status")
      .populate("slide", "slideId slideType stainingMethod status")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      qcRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch QC records for case",
    });
  }
};

const getQCRecordById = async (req, res) => {
  try {
    const qcRecord = await QCRecord.findById(req.params.id)
      .populate("case", "caseId caseType priority status")
      .populate("slide", "slideId slideType stainingMethod status")
      .populate("reviewedBy", "name email role");

    if (!qcRecord) {
      return res.status(404).json({
        message: "QC record not found",
      });
    }

    res.json({
      qcRecord,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch QC record",
    });
  }
};

const updateQCRecord = async (req, res) => {
  try {
    const qcRecord = await QCRecord.findById(req.params.id);
    if (!qcRecord) return res.status(404).json({ message: "QC record not found" });
    const previousData = {
      overallStatus: qcRecord.overallStatus,
      sectionQuality: qcRecord.sectionQuality,
      stainingQuality: qcRecord.stainingQuality,
      labelingCheck: qcRecord.labelingCheck,
      documentationCheck: qcRecord.documentationCheck,
    };
    for (const field of ["sectionQuality", "stainingQuality", "labelingCheck", "documentationCheck", "overallStatus", "findings", "correctiveAction"]) {
      if (req.body[field] !== undefined) qcRecord[field] = req.body[field];
    }
    qcRecord.reviewedBy = req.user.id;
    await qcRecord.save();
    await createAuditEntry({
      req, action: "UPDATE", module: "Quality Control", resourceType: "QCRecord", resourceId: qcRecord._id,
      description: "Quality control decision updated", previousData,
      newData: { overallStatus: qcRecord.overallStatus, sectionQuality: qcRecord.sectionQuality, stainingQuality: qcRecord.stainingQuality, labelingCheck: qcRecord.labelingCheck, documentationCheck: qcRecord.documentationCheck },
    });
    if (["FAILED", "NEEDS_REVIEW"].includes(qcRecord.overallStatus)) {
      await notifyRolesWithoutBlocking({
        roles: ["QUALITY_MANAGER"],
        eventKey: `qc-decision:${qcRecord._id}:${qcRecord.overallStatus}`,
        title: "Quality control requires attention",
        message: "A quality control decision requires review in the laboratory workspace.",
        type: "QC_ALERT",
        priority: qcRecord.overallStatus === "FAILED" ? "HIGH" : "MEDIUM",
        module: "Quality Control",
        resourceType: "QCRecord",
        resourceId: qcRecord._id,
        actionUrl: "/quality-dashboard",
      });
    }
    const populated = await QCRecord.findById(qcRecord._id)
      .populate("case", "caseId caseType priority status")
      .populate("slide", "slideId slideType stainingMethod status")
      .populate("reviewedBy", "name email role");

    if (!qcRecord) {
      return res.status(404).json({
        message: "QC record not found",
      });
    }

    res.json({
      message: "QC record updated successfully",
      qcRecord: populated,
    });
  } catch (error) {
    const response = getQCError(error);
    return res.status(response.status).json({ message: response.message });
  }
};

module.exports = {
  createQCRecord,
  getQCRecords,
  getQCRecordsByCase,
  getQCRecordById,
  updateQCRecord,
};
