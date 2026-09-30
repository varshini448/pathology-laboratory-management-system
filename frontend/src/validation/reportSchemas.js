export const reportSchema = {
  reportId: {
    required: true,
    message: "Report ID is required",
  },

  case: {
    required: true,
    message: "Case is required",
  },

  diagnosis: {
    required: true,
    minLength: 2,
    message: "Diagnosis is required",
  },

  microscopicFindings: {
    required: true,
    minLength: 2,
    message: "Microscopic findings are required",
  },

  reportStatus: {
    values: ["DRAFT", "FINAL"],
    message: "Please select a valid report status",
  },
};

export default reportSchema;