export const caseSchema = {
  caseId: {
    required: true,
    message: "Case ID is required",
  },

  patient: {
    required: true,
    message: "Patient is required",
  },

  doctor: {
    required: true,
    message: "Doctor is required",
  },

  priority: {
    required: true,
    values: ["NORMAL", "URGENT", "STAT"],
    message: "Please select a valid priority",
  },

  status: {
    values: [
      "REGISTERED",
      "SPECIMEN_COLLECTED",
      "IN_PROCESS",
      "COMPLETED",
      "REPORTED",
    ],
    message: "Please select a valid case status",
  },
};

export default caseSchema;