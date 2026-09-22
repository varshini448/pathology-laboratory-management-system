const Case = require("../../models/Case");
const Specimen = require("../../models/Specimen");
const Block = require("../../models/Block");
const Slide = require("../../models/Slide");
const WorkflowEvent = require("../../models/WorkflowEvent");
const QCRecord = require("../../models/QCRecord");

// Generate complete report data from an existing case
const generateReportData = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findById(caseId)
      .populate("patient")
      .populate("doctor")
      .populate("createdBy", "name email role");

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const specimens = await Specimen.find({
      case: caseId,
    })
      .populate("collectedBy", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: 1 });

    const blocks = await Block.find({
      case: caseId,
    })
      .populate(
        "specimen",
        "specimenId specimenType collectionSite"
      )
      .populate("createdBy", "name email role")
      .sort({ createdAt: 1 });

    const slides = await Slide.find({
      case: caseId,
    })
      .populate(
        "block",
        "blockId blockType tissueDescription processingStatus"
      )
      .populate("createdBy", "name email role")
      .sort({ createdAt: 1 });

    const workflowEvents = await WorkflowEvent.find({
      case: caseId,
    })
      .populate("performedBy", "name email role")
      .populate("specimen", "specimenId")
      .populate("block", "blockId")
      .populate("slide", "slideId")
      .sort({ createdAt: 1 });

    const qcRecords = await QCRecord.find({
      case: caseId,
    })
      .populate(
        "slide",
        "slideId slideType stainingMethod status"
      )
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

module.exports = {
  generateReportData,
};