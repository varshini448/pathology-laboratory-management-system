const crypto = require("crypto");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const EmailVerificationToken = require("../models/EmailVerificationToken");

const TOKEN_EXPIRY_HOURS = 24;

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const findAccount = async (userType, identifier) => {
  const value = identifier.trim().toLowerCase();

  if (userType === "INTERNAL") {
    return await User.findOne({ email: value });
  }

  if (userType === "PATIENT") {
    return await Patient.findOne({ email: value });
  }

  if (userType === "DOCTOR") {
    return await Doctor.findOne({ email: value });
  }

  return null;
};

const requestEmailVerification = async (req, res) => {
  try {
    const { userType, identifier } = req.body;

    if (!userType || !identifier) {
      return res.status(400).json({
        message: "User type and email are required.",
      });
    }

    if (!["INTERNAL", "PATIENT", "DOCTOR"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type.",
      });
    }

    const account = await findAccount(userType, identifier);

    if (!account) {
      return res.json({
        message:
          "If an account exists with this email, verification instructions will be sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    await EmailVerificationToken.deleteMany({
      userId: account._id,
      userType,
      usedAt: null,
    });

    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    await EmailVerificationToken.create({
      userId: account._id,
      userType,
      tokenHash,
      expiresAt,
    });

    // Development/demo response only.
    // Replace with email delivery service later.
    return res.json({
      message:
        "Verification instructions have been generated successfully.",
      verificationToken: rawToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Email verification request error:", error);

    return res.status(500).json({
      message: "Unable to process email verification request.",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required.",
      });
    }

    const tokenHash = hashToken(token);

    const verificationRecord = await EmailVerificationToken.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!verificationRecord) {
      return res.status(400).json({
        message: "Invalid or expired email verification token.",
      });
    }

    let account;

    if (verificationRecord.userType === "INTERNAL") {
      account = await User.findById(verificationRecord.userId);
    } else if (verificationRecord.userType === "PATIENT") {
      account = await Patient.findById(verificationRecord.userId);
    } else if (verificationRecord.userType === "DOCTOR") {
      account = await Doctor.findById(verificationRecord.userId);
    }

    if (!account) {
      return res.status(400).json({
        message: "Account associated with this token was not found.",
      });
    }

    // Email verification state will be added to account models
    // after the token flow is tested successfully.

    verificationRecord.usedAt = new Date();
    await verificationRecord.save();

    return res.json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      message: "Unable to verify email address.",
    });
  }
};

module.exports = {
  requestEmailVerification,
  verifyEmail,
};
