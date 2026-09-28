const WorkflowEvent = require("../models/WorkflowEvent");
const Case = require("../models/Case");
const Specimen = require("../models/Specimen");
const Block = require("../models/Block");
const Slide = require("../models/Slide");

const createWorkflowEvent = async (data) => {
  const {
    case: caseId,
    specimen: specimenId,
    block: blockId,
    slide: slideId,
    stage,
    status,
    notes,
    performedBy,
  } = data;

  if (!caseId) {
    throw new Error("Case is required for workflow event");
  }

  if (!stage) {
    throw new Error("Workflow stage is required");
  }

  if (!status) {
    throw new Error("Workflow status is required");
  }

  const caseData = await Case.findById(caseId);

  if (!caseData) {
    throw new Error("Case not found");
  }

  let updatedEntity;

  switch (stage) {
    case "SPECIMEN_COLLECTION":
      if (!specimenId) {
        throw new Error("Specimen is required for specimen collection");
      }

      updatedEntity = await Specimen.findByIdAndUpdate(
        specimenId,
        {
          status: "COLLECTED",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (status === "COMPLETED") {
        await Case.findByIdAndUpdate(caseId, {
          status: "SPECIMEN_COLLECTED",
        });
      }

      break;

    case "ACCESSIONING":
      if (!specimenId) {
        throw new Error("Specimen is required for accessioning");
      }

      updatedEntity = await Specimen.findByIdAndUpdate(
        specimenId,
        {
          status: status === "COMPLETED" ? "ACCESSIONED" : "RECEIVED",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "GROSSING":
      if (!blockId) {
        throw new Error("Block is required for grossing");
      }

      updatedEntity = await Block.findByIdAndUpdate(
        blockId,
        {
          processingStatus:
            status === "COMPLETED" ? "EMBEDDING" : "GROSSING",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "EMBEDDING":
      if (!blockId) {
        throw new Error("Block is required for embedding");
      }

      updatedEntity = await Block.findByIdAndUpdate(
        blockId,
        {
          processingStatus:
            status === "COMPLETED" ? "SECTIONING" : "EMBEDDING",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "SECTIONING":
      if (!blockId) {
        throw new Error("Block is required for sectioning");
      }

      updatedEntity = await Block.findByIdAndUpdate(
        blockId,
        {
          processingStatus:
            status === "COMPLETED" ? "COMPLETED" : "SECTIONING",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "STAINING":
      if (!slideId) {
        throw new Error("Slide is required for staining");
      }

      updatedEntity = await Slide.findByIdAndUpdate(
        slideId,
        {
          status: status === "COMPLETED" ? "STAINED" : "STAINING",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "SCANNING":
      if (!slideId) {
        throw new Error("Slide is required for scanning");
      }

      updatedEntity = await Slide.findByIdAndUpdate(
        slideId,
        {
          status: "SCANNED",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "PATHOLOGIST_REVIEW":
      if (!slideId) {
        throw new Error("Slide is required for pathologist review");
      }

      updatedEntity = await Slide.findByIdAndUpdate(
        slideId,
        {
          status:
            status === "COMPLETED" ? "COMPLETED" : "UNDER_REVIEW",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (status === "COMPLETED") {
        await Case.findByIdAndUpdate(caseId, {
          status: "COMPLETED",
        });
      } else {
        await Case.findByIdAndUpdate(caseId, {
          status: "IN_PROCESS",
        });
      }

      break;

    default:
      throw new Error("Invalid workflow stage");
  }

  if (!updatedEntity) {
    throw new Error("Related workflow entity not found");
  }

  const workflowEvent = await WorkflowEvent.create({
    case: caseId,
    specimen: specimenId,
    block: blockId,
    slide: slideId,
    stage,
    status,
    notes,
    performedBy,
  });

  return workflowEvent;
};

const getWorkflowEventsByCase = async (caseId) => {
  return WorkflowEvent.find({ case: caseId })
    .populate("specimen", "specimenId specimenType status")
    .populate("block", "blockId blockType processingStatus")
    .populate("slide", "slideId slideType status")
    .populate("performedBy", "name email role")
    .sort({ createdAt: 1 });
};

module.exports = {
  createWorkflowEvent,
  getWorkflowEventsByCase,
};