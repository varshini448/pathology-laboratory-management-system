const QCRecord = require("../models/QCRecord");

const createQCRecord = async (req, res) => {
  try {
    const qcRecord = await QCRecord.create({
      ...req.body,
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
    res.status(500).json({
      message: "Failed to create QC record",
      error: error.message,
    });
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
      error: error.message,
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
      error: error.message,
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
      error: error.message,
    });
  }
};

const updateQCRecord = async (req, res) => {
  try {
    const qcRecord = await QCRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    res.status(500).json({
      message: "Failed to update QC record",
      error: error.message,
    });
  }
};

module.exports = {
  createQCRecord,
  getQCRecords,
  getQCRecordsByCase,
  getQCRecordById,
  updateQCRecord,
};