const STATUS_LABELS = {
  REGISTERED: "Registered",
  SPECIMEN_COLLECTED: "Specimen Collected",
  IN_PROCESS: "In Process",
  COMPLETED: "Completed",
  REPORTED: "Reported",

  COLLECTED: "Collected",
  RECEIVED: "Received",
  ACCESSIONED: "Accessioned",
  PROCESSING: "Processing",

  CREATED: "Created",
  GROSSING: "Grossing",
  EMBEDDING: "Embedding",
  SECTIONING: "Sectioning",

  STAINING: "Staining",
  STAINED: "Stained",
  SCANNED: "Scanned",
  UNDER_REVIEW: "Under Review",

  DRAFT: "Draft",
  FINAL: "Final",

  PASSED: "Passed",
  FAILED: "Failed",
  NEEDS_REVIEW: "Needs Review",

  STARTED: "Started",
};

export const formatStatus = (status) => {
  if (!status) return "-";

  return (
    STATUS_LABELS[status] ||
    status
      .toString()
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

export const getStatusLabel = formatStatus;