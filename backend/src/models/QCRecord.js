const mongoose = require("mongoose");

const qcRecordSchema = new mongoose.Schema(
  {
    qcId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },

    slide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slide",
      required: true,
    },

    sectionQuality: {
      type: String,
      enum: ["GOOD", "ACCEPTABLE", "POOR"],
      required: true,
    },

    stainingQuality: {
      type: String,
      enum: ["GOOD", "ACCEPTABLE", "POOR"],
      required: true,
    },

    labelingCheck: {
      type: String,
      enum: ["PASS", "FAIL"],
      required: true,
    },

    documentationCheck: {
      type: String,
      enum: ["PASS", "FAIL"],
      required: true,
    },

    overallStatus: {
      type: String,
      enum: ["PASSED", "FAILED", "NEEDS_REVIEW"],
      required: true,
    },

    findings: {
      type: String,
      trim: true,
    },

    correctiveAction: {
      type: String,
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QCRecord", qcRecordSchema);