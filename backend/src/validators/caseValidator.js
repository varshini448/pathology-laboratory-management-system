const mongoose = require("mongoose");

const validateCase = (req, res, next) => {
  const {
    caseId,
    patient,
    doctor,
    caseType,
    clinicalHistory,
    priority,
  } = req.body;

  const errors = [];

  if (!caseId || !String(caseId).trim()) {
    errors.push("Case ID is required");
  } else if (!/^[A-Za-z0-9_-]+$/.test(String(caseId).trim())) {
    errors.push(
      "Case ID may contain only letters, numbers, hyphens, and underscores"
    );
  }

  if (!patient) {
    errors.push("Patient is required");
  } else if (!mongoose.Types.ObjectId.isValid(patient)) {
    errors.push("Invalid patient ID");
  }

  if (!doctor) {
    errors.push("Doctor is required");
  } else if (!mongoose.Types.ObjectId.isValid(doctor)) {
    errors.push("Invalid doctor ID");
  }

  if (!caseType || !String(caseType).trim()) {
    errors.push("Case type is required");
  }

  if (priority && !["NORMAL", "URGENT", "STAT"].includes(priority)) {
    errors.push("Priority must be NORMAL, URGENT, or STAT");
  }

  if (clinicalHistory && String(clinicalHistory).length > 5000) {
    errors.push("Clinical history cannot exceed 5000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Case validation failed",
      errors,
    });
  }

  req.body.caseId = String(caseId).trim();
  req.body.caseType = String(caseType).trim();

  if (clinicalHistory) {
    req.body.clinicalHistory = String(clinicalHistory).trim();
  }

  next();
};

module.exports = {
  validateCase,
};