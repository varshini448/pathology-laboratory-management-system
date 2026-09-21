const Report = require("../models/Report");
const Case = require("../models/Case");
const Specimen = require("../models/Specimen");
const Block = require("../models/Block");
const Slide = require("../models/Slide");
const WorkflowEvent = require("../models/WorkflowEvent");
const QCRecord = require("../models/QCRecord");

// Generate report data automatically from an existing case
const generateReportData = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Find the case with patient and doctor details
    const caseData = await Case.findById(caseId)
      .populate("patient")
      .populate("doctor")
      .populate("createdBy", "name email role");

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    // Find all specimens belonging to this case
    const specimens = await Specimen.find({
      case: caseId,
    })
      .populate("collectedBy", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: 1 });

    // Find all blocks belonging to this case
    const blocks = await Block.find({
      case: caseId,
    })
      .populate("specimen", "specimenId specimenType collectionSite")
      .populate("createdBy", "name email role")
      .sort({ createdAt: 1 });

    // Find all slides belonging to this case
    const slides = await Slide.find({
      case: caseId,
    })
      .populate("block", "blockId blockType tissueDescription processingStatus")
      .populate("createdBy", "name email role")
      .sort({ createdAt: 1 });

    // Find all workflow events for this case
    const workflowEvents = await WorkflowEvent.find({
      case: caseId,
    })
      .populate("performedBy", "name email role")
      .populate("specimen", "specimenId")
      .populate("block", "blockId")
      .populate("slide", "slideId")
      .sort({ createdAt: 1 });

    // Find all QA/QC records for this case
    const qcRecords = await QCRecord.find({
      case: caseId,
    })
      .populate("slide", "slideId slideType stainingMethod status")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Report data generated successfully",

      reportData: {
        case: caseData,
        specimens,
        blocks,
        slides,
        workflowEvents,
        qcRecords,
      },
    });
  } catch (error) {
    console.error("Generate report data error:", error);

    res.status(500).json({
      message: "Failed to generate report data",
      error: error.message,
    });
  }
};


// Create a new report
const createReport = async (req, res) => {
  try {
    const {
      reportId,
      case: caseId,
      slide,
      diagnosis,
      microscopicFindings,
      grossFindings,
      interpretation,
      recommendations,
      reportStatus,
    } = req.body;

    const report = await Report.create({
      reportId,
      case: caseId,
      slide,
      diagnosis,
      microscopicFindings,
      grossFindings,
      interpretation,
      recommendations,
      reportStatus,
      preparedBy: req.user.id,
    });

    const populatedReport = await Report.findById(report._id)
      .populate("case")
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role");

    res.status(201).json({
      message: "Report created successfully",
      report: populatedReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create report",
      error: error.message,
    });
  }
};


// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("case")
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};


// Get reports by case
const getReportsByCase = async (req, res) => {
  try {
    const reports = await Report.find({
      case: req.params.caseId,
    })
      .populate("case")
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports for case",
      error: error.message,
    });
  }
};


// Get report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("case")
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role");

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.status(200).json({
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};


// Update report
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const {
      diagnosis,
      microscopicFindings,
      grossFindings,
      interpretation,
      recommendations,
      reportStatus,
    } = req.body;

    report.diagnosis = diagnosis ?? report.diagnosis;
    report.microscopicFindings =
      microscopicFindings ?? report.microscopicFindings;
    report.grossFindings = grossFindings ?? report.grossFindings;
    report.interpretation = interpretation ?? report.interpretation;
    report.recommendations = recommendations ?? report.recommendations;
    report.reportStatus = reportStatus ?? report.reportStatus;

    if (reportStatus === "FINAL" && !report.reviewedBy) {
      report.reviewedBy = req.user.id;
      report.reviewedAt = new Date();
    }

    await report.save();

    const updatedReport = await Report.findById(report._id)
      .populate("case")
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role");

    res.status(200).json({
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update report",
      error: error.message,
    });
  }
};


module.exports = {
  generateReportData,
  createReport,
  getReports,
  getReportsByCase,
  getReportById,
  updateReport,
};