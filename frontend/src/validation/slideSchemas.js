export const slideSchema = {
  slideId: {
    required: true,
    message: "Slide ID is required",
  },

  block: {
    required: true,
    message: "Block is required",
  },

  status: {
    values: [
      "CREATED",
      "STAINING",
      "STAINED",
      "SCANNED",
      "UNDER_REVIEW",
      "COMPLETED",
    ],
    message: "Please select a valid slide status",
  },
};

export default slideSchema;