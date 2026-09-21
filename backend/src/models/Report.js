const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportId: {
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

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    microscopicFindings: {
      type: String,
      trim: true,
    },

    grossFindings: {
      type: String,
      trim: true,
    },

    interpretation: {
      type: String,
      trim: true,
    },

    recommendations: {
      type: String,
      trim: true,
    },

    reportStatus: {
      type: String,
      enum: ["DRAFT", "FINAL"],
      default: "DRAFT",
    },

    preparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);