const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const PasswordResetToken = require("../models/PasswordResetToken");

const TOKEN_EXPIRY_MINUTES = 30;

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const findAccount = async (accountType, identifier) => {
  const value = identifier.trim().toLowerCase();

  if (accountType === "internal") {
    const users = await User.find({
      $or: [
        { email: value },
        { "profile.employeeId": identifier.trim() },
        { "profile.medicalRegistrationId": identifier.trim() },
      ],
    });

    return users[0] || null;
  }

  const [patient, doctor] = await Promise.all([
    Patient.findOne({
      $or: [
        { email: value },
        { phone: identifier.trim() },
        { patientId: identifier.trim() },
      ],
    }),
    Doctor.findOne({
      $or: [
        { email: value },
        { phone: identifier.trim() },
        { doctorId: identifier.trim() },
        { medicalRegistrationId: identifier.trim() },
      ],
    }),
  ]);

  if (patient) {
    return patient;
  }

  return doctor;
};

const getUserType = (account) => {
  if (account instanceof User) {
    return "INTERNAL";
  }

  if (account instanceof Patient) {
    return "PATIENT";
  }

  if (account instanceof Doctor) {
    return "DOCTOR";
  }

  return null;
};

const requestPasswordReset = async (req, res) => {
  try {
    const { accountType, identifier } = req.body;

    if (!accountType || !identifier) {
      return res.status(400).json({
        message: "Account type and identifier are required.",
      });
    }

    if (!["internal", "external"].includes(accountType)) {
      return res.status(400).json({
        message: "Invalid account type.",
      });
    }

    const account = await findAccount(accountType, identifier);

    // Do not reveal whether an account exists.
    if (!account) {
      return res.json({
        message:
          "If an account exists with these details, password reset instructions will be sent.",
      });
    }

    const userType = getUserType(account);

    if (!userType) {
      return res.json({
        message:
          "If an account exists with these details, password reset instructions will be sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    await PasswordResetToken.deleteMany({
      userId: account._id,
      userType,
      usedAt: null,
    });

    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000
    );

    await PasswordResetToken.create({
      userId: account._id,
      userType,
      tokenHash,
      expiresAt,
    });

    // Development/demo response only.
    // Replace with email delivery service later.
    return res.json({
      message:
        "If an account exists with these details, password reset instructions will be sent.",
      resetToken: rawToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Password reset request error:", error);

    return res.status(500).json({
      message: "Unable to process password reset request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const tokenHash = hashToken(token);

    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return res.status(400).json({
        message: "Invalid or expired password reset token.",
      });
    }

    let account;

    if (resetRecord.userType === "INTERNAL") {
      account = await User.findById(resetRecord.userId);
    } else if (resetRecord.userType === "PATIENT") {
      account = await Patient.findById(resetRecord.userId);
    } else if (resetRecord.userType === "DOCTOR") {
      account = await Doctor.findById(resetRecord.userId);
    }

    if (!account) {
      return res.status(400).json({
        message: "Account associated with this token was not found.",
      });
    }

    account.password = await bcrypt.hash(password, 10);
    await account.save();

    resetRecord.usedAt = new Date();
    await resetRecord.save();

    return res.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
