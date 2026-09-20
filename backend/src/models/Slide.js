const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    slideId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },

    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    slideType: {
      type: String,
      required: true,
      trim: true,
    },

    stainingMethod: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "STAINING",
        "STAINED",
        "SCANNED",
        "UNDER_REVIEW",
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

module.exports = mongoose.model("Slide", slideSchema);