const WorkflowEvent = require("../models/WorkflowEvent");
const Case = require("../models/Case");
const Specimen = require("../models/Specimen");
const Block = require("../models/Block");
const Slide = require("../models/Slide");

const workflowError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const requireRelatedEntity = async (Model, entityId, caseId, entityName) => {
  const entity = await Model.findById(entityId);

  if (!entity) {
    throw workflowError(`${entityName} not found`, 404);
  }

  const relatedCaseId = entity.case?._id || entity.case;
  if (!relatedCaseId || String(relatedCaseId) !== String(caseId)) {
    throw workflowError(`${entityName} does not belong to this case`);
  }

  return entity;
};

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
    throw workflowError("Case is required for workflow event");
  }

  if (!stage) {
    throw workflowError("Workflow stage is required");
  }

  if (!status) {
    throw workflowError("Workflow status is required");
  }

  if (!["STARTED", "COMPLETED"].includes(status)) {
    throw workflowError("Workflow status must be STARTED or COMPLETED");
  }

  const caseData = await Case.findById(caseId);

  if (!caseData) {
    throw workflowError("Case not found", 404);
  }

  let updatedEntity;

  switch (stage) {
    case "SPECIMEN_COLLECTION":
      if (!specimenId) {
        throw new Error("Specimen is required for specimen collection");
      }

      updatedEntity = await requireRelatedEntity(
        Specimen,
        specimenId,
        caseId,
        "Specimen"
      );

      if (status === "COMPLETED") {
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
      }

      if (!updatedEntity) throw workflowError("Specimen not found", 404);

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

      await requireRelatedEntity(Specimen, specimenId, caseId, "Specimen");
      updatedEntity = await Specimen.findByIdAndUpdate(specimenId, {
        status: status === "COMPLETED" ? "ACCESSIONED" : "RECEIVED",
      }, { new: true, runValidators: true });

      if (!updatedEntity) throw workflowError("Specimen not found", 404);

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "GROSSING":
      if (!blockId) {
        throw new Error("Block is required for grossing");
      }

      await requireRelatedEntity(Block, blockId, caseId, "Block");
      updatedEntity = await Block.findByIdAndUpdate(blockId, {
        processingStatus: status === "COMPLETED" ? "EMBEDDING" : "GROSSING",
      }, { new: true, runValidators: true });

      if (!updatedEntity) throw workflowError("Block not found", 404);

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "EMBEDDING":
      if (!blockId) {
        throw new Error("Block is required for embedding");
      }

      await requireRelatedEntity(Block, blockId, caseId, "Block");
      updatedEntity = await Block.findByIdAndUpdate(blockId, {
        processingStatus: status === "COMPLETED" ? "SECTIONING" : "EMBEDDING",
      }, { new: true, runValidators: true });

      if (!updatedEntity) throw workflowError("Block not found", 404);

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "SECTIONING":
      if (!blockId) {
        throw new Error("Block is required for sectioning");
      }

      await requireRelatedEntity(Block, blockId, caseId, "Block");
      updatedEntity = await Block.findByIdAndUpdate(blockId, {
        processingStatus: status === "COMPLETED" ? "COMPLETED" : "SECTIONING",
      }, { new: true, runValidators: true });

      if (!updatedEntity) throw workflowError("Block not found", 404);

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "STAINING":
      if (!slideId) {
        throw new Error("Slide is required for staining");
      }

      await requireRelatedEntity(Slide, slideId, caseId, "Slide");
      updatedEntity = await Slide.findByIdAndUpdate(slideId, {
        status: status === "COMPLETED" ? "STAINED" : "STAINING",
      }, { new: true, runValidators: true });

      if (!updatedEntity) throw workflowError("Slide not found", 404);

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "SCANNING":
      if (!slideId) {
        throw new Error("Slide is required for scanning");
      }

      updatedEntity = await requireRelatedEntity(Slide, slideId, caseId, "Slide");

      if (status === "COMPLETED") {
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
      }

      if (!updatedEntity) throw workflowError("Slide not found", 404);

      await Case.findByIdAndUpdate(caseId, {
        status: "IN_PROCESS",
      });

      break;

    case "PATHOLOGIST_REVIEW":
      if (!slideId) {
        throw new Error("Slide is required for pathologist review");
      }

      await requireRelatedEntity(Slide, slideId, caseId, "Slide");
      updatedEntity = await Slide.findByIdAndUpdate(slideId, {
        status: status === "COMPLETED" ? "COMPLETED" : "UNDER_REVIEW",
      }, { new: true, runValidators: true });

      if (!updatedEntity) throw workflowError("Slide not found", 404);

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
      throw workflowError("Invalid workflow stage");
  }

  if (!updatedEntity) {
    throw workflowError("Related workflow entity not found", 404);
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
  const caseData = await Case.findOne({ caseId });

  if (!caseData) {
    throw workflowError("Case not found", 404);
  }

  return WorkflowEvent.find({ case: caseData._id })
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
