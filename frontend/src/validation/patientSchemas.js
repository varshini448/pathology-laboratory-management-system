export const patientSchema = {
  patientId: {
    required: true,
    message: "Patient ID is required",
  },

  name: {
    required: true,
    minLength: 2,
    message: "Patient name must contain at least 2 characters",
  },

  dateOfBirth: {
    required: true,
    message: "Date of birth is required",
  },

  gender: {
    required: true,
    values: ["MALE", "FEMALE", "OTHER"],
    message: "Please select a valid gender",
  },

  phone: {
    required: true,
    pattern: /^[0-9]{10}$/,
    message: "Phone number must contain exactly 10 digits",
  },

  status: {
    values: ["ACTIVE", "INACTIVE", "SUSPENDED"],
    message: "Please select a valid patient status",
  },
};

export default patientSchema;