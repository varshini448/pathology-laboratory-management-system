export const specimenSchema = {
  specimenId: {
    required: true,
    message: "Specimen ID is required",
  },

  case: {
    required: true,
    message: "Case is required",
  },

  collectionDate: {
    required: true,
    message: "Collection date is required",
  },

  quality: {
    values: ["GOOD", "DAMAGED", "INADEQUATE"],
    message: "Please select a valid specimen quality",
  },

  status: {
    values: [
      "COLLECTED",
      "RECEIVED",
      "ACCESSIONED",
      "PROCESSING",
      "COMPLETED",
    ],
    message: "Please select a valid specimen status",
  },
};

export default specimenSchema;