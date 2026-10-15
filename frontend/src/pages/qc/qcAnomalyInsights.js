const isPoorQuality = (value) => value === "POOR";

export const analyzeQCRecord = (record = {}) => {
  const flags = [];

  if (isPoorQuality(record.sectionQuality)) {
    flags.push({
      code: "POOR_SECTION_QUALITY",
      title: "Poor section quality",
      action: "Review the section preparation findings and document any corrective action.",
    });
  }

  if (isPoorQuality(record.stainingQuality)) {
    flags.push({
      code: "POOR_STAINING_QUALITY",
      title: "Poor staining quality",
      action: "Review staining observations and check the recorded processing steps.",
    });
  }

  if (record.labelingCheck === "FAIL") {
    flags.push({
      code: "LABELING_FAILURE",
      title: "Labeling check failed",
      action: "Verify slide identification and resolve the labeling exception under laboratory policy.",
    });
  }

  if (record.documentationCheck === "FAIL") {
    flags.push({
      code: "DOCUMENTATION_FAILURE",
      title: "Documentation check failed",
      action: "Review the QC documentation and complete any missing required records.",
    });
  }

  const hasFailedCheck =
    record.labelingCheck === "FAIL" ||
    record.documentationCheck === "FAIL";

  const hasPoorQuality =
    isPoorQuality(record.sectionQuality) ||
    isPoorQuality(record.stainingQuality);

  if (record.overallStatus === "PASSED" && (hasFailedCheck || hasPoorQuality)) {
    flags.push({
      code: "STATUS_REVIEW_MISMATCH",
      title: "Review overall status",
      action: "Reconcile the recorded check results with the overall status; do not assume the status is correct.",
    });
  }

  return flags;
};

export const getQCAnomalyInsights = (records = []) => {
  const safeRecords = Array.isArray(records) ? records : [];
  const issueCounts = new Map();
  const flaggedRecords = [];

  safeRecords.forEach((record) => {
    const flags = analyzeQCRecord(record);

    if (flags.length > 0) {
      flaggedRecords.push({ record, flags });
    }

    flags.forEach((flag) => {
      const current = issueCounts.get(flag.code) || {
        code: flag.code,
        title: flag.title,
        count: 0,
        action: flag.action,
      };

      current.count += 1;
      issueCounts.set(flag.code, current);
    });
  });

  const patterns = [...issueCounts.values()]
    .filter((issue) => issue.count >= 2)
    .sort((a, b) => b.count - a.count);

  return {
    recordsAnalyzed: safeRecords.length,
    flaggedRecordCount: flaggedRecords.length,
    flaggedRecords,
    patterns,
  };
};
