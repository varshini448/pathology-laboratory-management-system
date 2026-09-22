const Report = require("../../models/Report");

// Create a new report draft
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
      reportStatus: "DRAFT",
      preparedBy: req.user.id,
    });

    const populatedReport = await Report.findById(report._id)
      .populate({
        path: "case",
        populate: {
          path: "patient",
        },
      })
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role");

    res.status(201).json({
      message: "Report draft created successfully",
      report: populatedReport,
    });
  } catch (error) {
    console.error("Create report error:", error);

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
      .populate({
        path: "case",
        populate: {
          path: "patient",
        },
      })
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

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
      .populate({
        path: "case",
        populate: {
          path: "patient",
        },
      })
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    console.error("Get reports by case error:", error);

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
      .populate({
        path: "case",
        populate: {
          path: "patient",
        },
      })
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
    console.error("Get report by ID error:", error);

    res.status(500).json({
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

// Update a draft report
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.reportStatus === "FINAL") {
      return res.status(400).json({
        message: "Final reports cannot be edited.",
      });
    }

    const {
      diagnosis,
      microscopicFindings,
      grossFindings,
      interpretation,
      recommendations,
    } = req.body;

    report.diagnosis =
      diagnosis ?? report.diagnosis;

    report.microscopicFindings =
      microscopicFindings ?? report.microscopicFindings;

    report.grossFindings =
      grossFindings ?? report.grossFindings;

    report.interpretation =
      interpretation ?? report.interpretation;

    report.recommendations =
      recommendations ?? report.recommendations;

    report.reportStatus = "DRAFT";

    await report.save();

    const updatedReport = await Report.findById(report._id)
      .populate({
        path: "case",
        populate: {
          path: "patient",
        },
      })
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role");

    res.status(200).json({
      message: "Report draft updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update report error:", error);

    res.status(500).json({
      message: "Failed to update report draft",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportsByCase,
  getReportById,
  updateReport,
};