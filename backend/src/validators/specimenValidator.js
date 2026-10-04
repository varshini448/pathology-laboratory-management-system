const mongoose = require("mongoose");

const validateSpecimen = (req, res, next) => {
  const {
    specimenId,
    case: caseId,
    specimenType,
    collectionSite,
    collectionDate,
    receivedDate,
    condition,
    status,
    notes,
  } = req.body;

  const errors = [];

  if (!specimenId || !String(specimenId).trim()) {
    errors.push("Specimen ID is required");
  } else if (!/^[A-Za-z0-9_-]+$/.test(String(specimenId).trim())) {
    errors.push(
      "Specimen ID may contain only letters, numbers, hyphens, and underscores"
    );
  }

  if (!caseId) {
    errors.push("Case is required");
  } else if (!mongoose.Types.ObjectId.isValid(caseId)) {
    errors.push("Invalid case ID");
  }

  if (!specimenType || !String(specimenType).trim()) {
    errors.push("Specimen type is required");
  }

  if (
    condition &&
    !["GOOD", "DAMAGED", "INADEQUATE"].includes(condition)
  ) {
    errors.push(
      "Condition must be GOOD, DAMAGED, or INADEQUATE"
    );
  }

  if (
    status &&
    ![
      "COLLECTED",
      "RECEIVED",
      "ACCESSIONED",
      "PROCESSING",
      "COMPLETED",
    ].includes(status)
  ) {
    errors.push(
      "Status must be COLLECTED, RECEIVED, ACCESSIONED, PROCESSING, or COMPLETED"
    );
  }

  if (
    collectionDate &&
    Number.isNaN(Date.parse(collectionDate))
  ) {
    errors.push("Invalid collection date");
  }

  if (
    receivedDate &&
    Number.isNaN(Date.parse(receivedDate))
  ) {
    errors.push("Invalid received date");
  }

  if (notes && String(notes).length > 5000) {
    errors.push("Notes cannot exceed 5000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Specimen validation failed",
      errors,
    });
  }

  req.body.specimenId = String(specimenId).trim();
  req.body.specimenType = String(specimenType).trim();

  if (collectionSite) {
    req.body.collectionSite = String(collectionSite).trim();
  }

  if (notes) {
    req.body.notes = String(notes).trim();
  }

  next();
};

module.exports = {
  validateSpecimen,
};
