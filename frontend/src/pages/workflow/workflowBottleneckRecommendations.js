const STAGE_ACTIONS = {
  SPECIMEN_COLLECTION: {
    action: "Verify collection status and identify any pending specimen handoff.",
    rationale: "Collection progress may need operational follow-up.",
  },
  ACCESSIONING: {
    action: "Check specimen receipt, identification, and accessioning queue.",
    rationale: "Confirm the case is ready for the next workflow stage.",
  },
  GROSSING: {
    action: "Review the grossing queue and confirm staff or workstation availability.",
    rationale: "Check for a pending processing handoff or capacity constraint.",
  },
  EMBEDDING: {
    action: "Review pending embedding work and confirm the next processing step.",
    rationale: "Identify work waiting in the embedding queue.",
  },
  SECTIONING: {
    action: "Review the sectioning queue and check for pending block preparation.",
    rationale: "Confirm whether the case is waiting for processing or a handoff.",
  },
  STAINING: {
    action: "Check staining queue status and verify that required processing steps are recorded.",
    rationale: "Identify pending work or incomplete workflow documentation.",
  },
  SCANNING: {
    action: "Check scanner availability and review slides awaiting scanning.",
    rationale: "Identify a possible equipment or queue-related delay.",
  },
  PATHOLOGIST_REVIEW: {
    action: "Review the pending case queue and prioritize according to urgency and laboratory policy.",
    rationale: "Ensure delayed cases receive appropriate operational review.",
  },
};

export const getWorkflowBottleneckRecommendation = (stage) =>
  STAGE_ACTIONS[String(stage || "").toUpperCase()] || {
    action: "Review the current stage, its pending queue, and the next required handoff.",
    rationale: "Confirm the operational status before taking action.",
  };
