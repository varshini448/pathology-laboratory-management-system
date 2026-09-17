const mongoose = require("mongoose");

const specimenSchema = new mongoose.Schema(
  {
    specimenId: {
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

    specimenType: {
      type: String,
      required: true,
      trim: true,
    },

    collectionSite: {
      type: String,
      trim: true,
    },

    collectionDate: {
      type: Date,
      default: Date.now,
    },

    receivedDate: {
      type: Date,
    },

    condition: {
      type: String,
      enum: ["GOOD", "DAMAGED", "INADEQUATE"],
      default: "GOOD",
    },

    status: {
      type: String,
      enum: [
        "COLLECTED",
        "RECEIVED",
        "ACCESSIONED",
        "PROCESSING",
        "COMPLETED",
      ],
      default: "COLLECTED",
    },

    notes: {
      type: String,
      trim: true,
    },

    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

module.exports = mongoose.model("Specimen", specimenSchema);