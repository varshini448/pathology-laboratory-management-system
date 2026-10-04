const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "INFO",
        "SUCCESS",
        "WARNING",
        "ERROR",
        "TAT_ALERT",
        "QC_ALERT",
        "WORKFLOW_ALERT",
        "REPORT_ALERT",
        "CASE_ALERT",
        "SYSTEM_ALERT",
      ],
      default: "INFO",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    module: {
      type: String,
      trim: true,
    },

    resourceType: {
      type: String,
      trim: true,
    },

    resourceId: {
      type: String,
      trim: true,
    },

    actionUrl: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Frequently used notification queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ priority: 1, createdAt: -1 });
notificationSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model("Notification", notificationSchema);