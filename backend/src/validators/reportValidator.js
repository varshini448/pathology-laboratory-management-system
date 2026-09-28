const validateReport = (req, res, next) => {
  const {
    reportId,
    case: caseId,
    slide,
    diagnosis,
  } = req.body;

  const errors = [];

  if (!reportId || typeof reportId !== "string" || !reportId.trim()) {
    errors.push("Report ID is required.");
  }

  if (!caseId || typeof caseId !== "string" || !caseId.trim()) {
    errors.push("Case ID is required.");
  }

  if (!slide || typeof slide !== "string" || !slide.trim()) {
    errors.push("Slide ID is required.");
  }

  if (!diagnosis || typeof diagnosis !== "string" || !diagnosis.trim()) {
    errors.push("Diagnosis is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Report validation failed.",
      errors,
    });
  }

  next();
};

module.exports = {
  validateReport,
};