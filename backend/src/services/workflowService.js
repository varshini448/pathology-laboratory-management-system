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

  let updatedEntity;

  switch (stage) {
    case "SPECIMEN_COLLECTION":
      if (!specimenId) {
        throw new Error("Specimen is required for specimen collection");
      }

      updatedEntity = await Specimen.findByIdAndUpdate(
        specimenId,
        {
          status: status === "COMPLETED" ? "COLLECTED" : "COLLECTED",
        },
        {
          new: true,
          runValidators: true,
        }
      );
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
      break;

    case "GROSSING":
      if (!blockId) {
        throw new Error("Block is required for grossing");
      }

      updatedEntity = await Block.findByIdAndUpdate(
        blockId,
        {
          processingStatus: "GROSSING",
        },
        {
          new: true,
          runValidators: true,
        }
      );
      break;

    case "EMBEDDING":
      if (!blockId) {
        throw new Error("Block is required for embedding");
      }

      updatedEntity = await Block.findByIdAndUpdate(
        blockId,
        {
          processingStatus: "EMBEDDING",
        },
        {
          new: true,
          runValidators: true,
        }
      );
      break;

    case "SECTIONING":
      if (!blockId) {
        throw new Error("Block is required for sectioning");
      }

      updatedEntity = await Block.findByIdAndUpdate(
        blockId,
        {
          processingStatus: "SECTIONING",
        },
        {
          new: true,
          runValidators: true,
        }
      );
      break;

    case "STAINING":
      if (!slideId) {
        throw new Error("Slide is required for staining");
      }

      updatedEntity = await Slide.findByIdAndUpdate(
        slideId,
        {
          status: "STAINING",
        },
        {
          new: true,
          runValidators: true,
        }
      );
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
      break;

    case "PATHOLOGIST_REVIEW":
      if (!slideId) {
        throw new Error("Slide is required for pathologist review");
      }

      updatedEntity = await Slide.findByIdAndUpdate(
        slideId,
        {
          status: "UNDER_REVIEW",
        },
        {
          new: true,
          runValidators: true,
        }
      );
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