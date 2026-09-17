const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    blockId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    specimen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specimen",
      required: true,
    },

    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    blockType: {
      type: String,
      required: true,
      trim: true,
    },

    tissueDescription: {
      type: String,
      trim: true,
    },

    processingStatus: {
      type: String,
      enum: [
        "CREATED",
        "GROSSING",
        "EMBEDDING",
        "SECTIONING",
        "COMPLETED",
      ],
      default: "CREATED",
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Block", blockSchema);