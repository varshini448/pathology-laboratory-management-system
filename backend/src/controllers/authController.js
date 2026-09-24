const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// REGISTER INTERNAL USER
// ==========================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      department,
      profile = {},
    } = req.body;

    // --------------------------------------
    // Basic validation
    // --------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !phone ||
      !department
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // --------------------------------------
    // Public registration roles
    // --------------------------------------

    const allowedPublicRoles = [
      "TECHNICIAN",
      "PATHOLOGIST",
      "QUALITY_MANAGER",
    ];

    if (!allowedPublicRoles.includes(role)) {
      return res.status(403).json({
        message:
          "Public registration is available only for Technicians, Pathologists and Quality Managers. Admin accounts must be created by an administrator.",
      });
    }

    // --------------------------------------
    // Normalize email
    // --------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    // --------------------------------------
    // Check existing email
    // --------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    // --------------------------------------
    // Phone validation
    // --------------------------------------

    const normalizedPhone = phone.trim();

    const phoneRegex = /^\+91[6-9]\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return res.status(400).json({
        message:
          "Please enter a valid Indian phone number in +91XXXXXXXXXX format",
      });
    }

    // --------------------------------------
    // Role-specific validation
    // --------------------------------------

    if (role === "TECHNICIAN") {
      if (!profile.employeeId || !profile.qualification) {
        return res.status(400).json({
          message:
            "Employee ID and qualification are required for technicians",
        });
      }
    }

    if (role === "PATHOLOGIST") {
      if (
        !profile.medicalRegistrationId ||
        !profile.qualification ||
        !profile.specialization
      ) {
        return res.status(400).json({
          message:
            "Medical Registration ID, qualification and specialization are required for pathologists",
        });
      }
    }

    if (role === "QUALITY_MANAGER") {
      if (!profile.employeeId || !profile.qualification) {
        return res.status(400).json({
          message:
            "Employee ID and qualification are required for quality managers",
        });
      }
    }

    // --------------------------------------
    // Check Employee ID
    // --------------------------------------

    if (profile.employeeId) {
      const existingEmployee = await User.findOne({
        "profile.employeeId": profile.employeeId.trim(),
      });

      if (existingEmployee) {
        return res.status(400).json({
          message: "Employee ID already exists",
        });
      }
    }

    // --------------------------------------
    // Check Medical Registration ID
    // --------------------------------------

    if (profile.medicalRegistrationId) {
      const existingRegistration = await User.findOne({
        "profile.medicalRegistrationId":
          profile.medicalRegistrationId.trim(),
      });

      if (existingRegistration) {
        return res.status(400).json({
          message: "Medical Registration ID already exists",
        });
      }
    }

    // --------------------------------------
    // Hash password
    // --------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // --------------------------------------
    // Create account
    // --------------------------------------

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone,
      department: department.trim(),
      role,
      status: "PENDING_APPROVAL",
      profile,
    });

    // --------------------------------------
    // Response
    // --------------------------------------

    return res.status(201).json({
      message:
        "Registration submitted successfully. Your account is pending administrator approval.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN INTERNAL USER
// ==========================================

const login = async (req, res) => {
  try {
    const {
      identifier,
      password,
      accountType = "internal",
    } = req.body;

    // --------------------------------------
    // Validate request
    // --------------------------------------

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required",
      });
    }

    // --------------------------------------
    // Current endpoint handles internal users
    // --------------------------------------

    if (accountType !== "internal") {
      return res.status(400).json({
        message:
          "Patient and Doctor authentication will be handled separately.",
      });
    }

    // --------------------------------------
    // Normalize identifier
    // --------------------------------------

    const normalizedIdentifier = identifier.trim();

    // --------------------------------------
    // Find user
    //
    // Supports:
    // Email
    // Employee ID
    // Medical Registration ID
    // --------------------------------------

    const user = await User.findOne({
      $or: [
        {
          email: normalizedIdentifier.toLowerCase(),
        },
        {
          "profile.employeeId": normalizedIdentifier,
        },
        {
          "profile.medicalRegistrationId": normalizedIdentifier,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid identifier or password",
      });
    }

    // --------------------------------------
    // Check account status
    // --------------------------------------

    if (user.status === "PENDING_APPROVAL") {
      return res.status(403).json({
        message:
          "Your account is pending administrator approval.",
      });
    }

    if (user.status === "INACTIVE") {
      return res.status(403).json({
        message:
          "Your account is inactive. Please contact an administrator.",
      });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        message:
          "Your account has been suspended. Please contact an administrator.",
      });
    }

    // --------------------------------------
    // Verify password
    // --------------------------------------

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid identifier or password",
      });
    }

    // --------------------------------------
    // Update last login
    // --------------------------------------

    user.lastLogin = new Date();

    await user.save();

    // --------------------------------------
    // Generate JWT
    // --------------------------------------

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        userType: "INTERNAL",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // --------------------------------------
    // Response
    // --------------------------------------

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        userType: "INTERNAL",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
