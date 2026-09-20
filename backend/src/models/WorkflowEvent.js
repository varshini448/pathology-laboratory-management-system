const mongoose = require("mongoose");

const workflowEventSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    specimen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specimen",
    },

    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
    },

    slide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slide",
    },

    stage: {
      type: String,
      enum: [
        "SPECIMEN_COLLECTION",
        "ACCESSIONING",
        "GROSSING",
        "EMBEDDING",
        "SECTIONING",
        "STAINING",
        "SCANNING",
        "PATHOLOGIST_REVIEW",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["STARTED", "COMPLETED"],
      default: "STARTED",
    },

    notes: {
      type: String,
      trim: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkflowEvent", workflowEventSchema);
