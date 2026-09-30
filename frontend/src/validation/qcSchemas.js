export const qcSchema = {
  case: {
    required: true,
    message: "Case is required",
  },

  slide: {
    required: true,
    message: "Slide is required",
  },

  stainingQuality: {
    values: ["GOOD", "ACCEPTABLE", "POOR"],
    message: "Please select a valid staining quality",
  },

  slideQuality: {
    values: ["GOOD", "ACCEPTABLE", "POOR"],
    message: "Please select a valid slide quality",
  },

  stainingCheck: {
    values: ["PASS", "FAIL"],
    message: "Please select a valid staining check result",
  },

  slideCheck: {
    values: ["PASS", "FAIL"],
    message: "Please select a valid slide check result",
  },

  result: {
    values: ["PASSED", "FAILED", "NEEDS_REVIEW"],
    message: "Please select a valid QC result",
  },
};

export default qcSchema;