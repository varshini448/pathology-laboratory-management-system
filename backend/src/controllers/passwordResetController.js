const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const PasswordResetToken = require("../models/PasswordResetToken");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const INVALID_TOKEN_MESSAGE = "Invalid or expired password reset token.";

const requestPasswordReset = async (req, res) => {
  const { accountType, identifier } = req.body || {};

  if (
    !accountType ||
    typeof identifier !== "string" ||
    !identifier.trim()
  ) {
    return res.status(400).json({
      message: "Account type and identifier are required.",
    });
  }

  if (!["internal", "external"].includes(accountType)) {
    return res.status(400).json({
      message: "Invalid account type.",
    });
  }

  // Do not generate or return reset tokens until secure email delivery
  // has been configured.
  return res.status(503).json({
    message:
      "Password reset delivery is not configured. Please contact your system administrator.",
  });
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (
      typeof token !== "string" ||
      !/^[a-f\d]{64}$/i.test(token) ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    // Atomically claim the token so concurrent requests cannot both pass the
    // one-time-use check and change the account password.
    const resetRecord = await PasswordResetToken.findOneAndUpdate({
      tokenHash: hashToken(token),
      usedAt: null,
      expiresAt: { $gt: new Date() },
    }, {
      $set: { usedAt: new Date() },
    }, {
      new: true,
    });

    if (!resetRecord) {
      return res.status(400).json({
        message: INVALID_TOKEN_MESSAGE,
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
        message: INVALID_TOKEN_MESSAGE,
      });
    }

    account.password = await bcrypt.hash(password, 10);
    await account.save();

    return res.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Password reset error");

    return res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
