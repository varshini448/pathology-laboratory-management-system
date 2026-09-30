export const loginSchema = {
  email: {
    required: true,
    message: "Email is required",
  },

  password: {
    required: true,
    minLength: 6,
    message: "Password must contain at least 6 characters",
  },
};

export const registerSchema = {
  name: {
    required: true,
    minLength: 2,
    message: "Name must contain at least 2 characters",
  },

  email: {
    required: true,
    message: "Email is required",
  },

  password: {
    required: true,
    minLength: 6,
    message: "Password must contain at least 6 characters",
  },

  confirmPassword: {
    required: true,
    message: "Please confirm your password",
  },
};

export const passwordResetSchema = {
  email: {
    required: true,
    message: "Email is required",
  },
};

export default {
  loginSchema,
  registerSchema,
  passwordResetSchema,
};