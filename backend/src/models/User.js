const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // COMMON ACCOUNT DETAILS
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
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

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+91[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: [
        "ADMIN",
        "TECHNICIAN",
        "PATHOLOGIST",
        "QUALITY_MANAGER",
      ],
      default: "TECHNICIAN",
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
        "PENDING_APPROVAL",
      ],
      default: "ACTIVE",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // =========================
    // ROLE-SPECIFIC PROFILE
    // =========================

    profile: {
      // Admin / Technician / Quality Manager
      employeeId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
      },

      // Admin
      designation: {
        type: String,
        trim: true,
      },

      // Technician / Pathologist / Quality Manager
      qualification: {
        type: String,
        trim: true,
      },

      // Technician
      assignedShift: {
        type: String,
        trim: true,
      },

      workstation: {
        type: String,
        trim: true,
      },

      certification: {
        type: String,
        trim: true,
      },

      joiningDate: {
        type: Date,
      },

      // Pathologist
      medicalRegistrationId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
      },

      specialization: {
        type: String,
        trim: true,
      },

      registrationAuthority: {
        type: String,
        trim: true,
      },

      registrationValidUntil: {
        type: Date,
      },

      digitalSignature: {
        type: String,
        trim: true,
      },

      // Quality Manager
      qualityCertification: {
        type: String,
        trim: true,
      },

      auditResponsibility: {
        type: String,
        trim: true,
      },

      // Admin
      profilePhoto: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);