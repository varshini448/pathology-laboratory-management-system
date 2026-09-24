const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    medicalRegistrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    registrationAuthority: {
      type: String,
      required: true,
      trim: true,
    },

    hospital: {
      type: String,
      trim: true,
    },

    hospitalAddress: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+91[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "PENDING_VERIFICATION",
    },

    lastLogin: {
      type: Date,
      default: null,
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

module.exports = mongoose.model("Doctor", doctorSchema);
