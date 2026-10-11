const QCRecord = require("../models/QCRecord");
const Case = require("../models/Case");
const Slide = require("../models/Slide");

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
    const qcRecord = await QCRecord.findByIdAndUpdate(
      req.params.id,
      {
        sectionQuality: req.body.sectionQuality,
        stainingQuality: req.body.stainingQuality,
        labelingCheck: req.body.labelingCheck,
        documentationCheck: req.body.documentationCheck,
        overallStatus: req.body.overallStatus,
        findings: req.body.findings,
        correctiveAction: req.body.correctiveAction,
      },
      {
        new: true,
        runValidators: true,
      }
    )
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
      qcRecord,
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
