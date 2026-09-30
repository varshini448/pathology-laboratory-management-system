export const doctorSchema = {
  doctorId: {
    required: true,
    message: "Doctor ID is required",
  },

  name: {
    required: true,
    minLength: 2,
    message: "Doctor name must contain at least 2 characters",
  },

  email: {
    required: true,
    message: "Email is required",
  },

  phone: {
    required: true,
    pattern: /^[0-9]{10}$/,
    message: "Phone number must contain exactly 10 digits",
  },

  specialization: {
    required: true,
    minLength: 2,
    message: "Specialization is required",
  },

  status: {
    values: ["PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "SUSPENDED"],
    message: "Please select a valid doctor status",
  },
};

export default doctorSchema;