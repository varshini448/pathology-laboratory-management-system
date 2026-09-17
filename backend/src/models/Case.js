const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    caseType: {
      type: String,
      required: true,
      trim: true,
    },

    clinicalHistory: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["NORMAL", "URGENT", "STAT"],
      default: "NORMAL",
    },

    status: {
      type: String,
      enum: [
        "REGISTERED",
        "SPECIMEN_COLLECTED",
        "IN_PROCESS",
        "COMPLETED",
        "REPORTED",
      ],
      default: "REGISTERED",
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

module.exports = mongoose.model("Case", caseSchema);