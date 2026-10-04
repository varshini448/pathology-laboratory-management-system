const validateRegister = (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    department,
    profile = {},
  } = req.body;

  const errors = [];

  // -----------------------------
  // Common required fields
  // -----------------------------

  if (!name || !String(name).trim()) {
    errors.push("Name is required");
  } else if (String(name).trim().length < 2) {
    errors.push("Name must contain at least 2 characters");
  }

  if (!email || !String(email).trim()) {
    errors.push("Email is required");
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
  ) {
    errors.push("Please enter a valid email address");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (String(password).length < 8) {
    errors.push("Password must contain at least 8 characters");
  }

  if (!phone || !String(phone).trim()) {
    errors.push("Phone number is required");
  } else if (!/^\+91[6-9]\d{9}$/.test(String(phone).trim())) {
    errors.push(
      "Please enter a valid Indian phone number in +91XXXXXXXXXX format"
    );
  }

  if (!department || !String(department).trim()) {
    errors.push("Department is required");
  }

  // -----------------------------
  // Role validation
  // -----------------------------

  const allowedRoles = [
    "TECHNICIAN",
    "PATHOLOGIST",
    "QUALITY_MANAGER",
  ];

  if (!role) {
    errors.push("Role is required");
  } else if (!allowedRoles.includes(role)) {
    errors.push(
      "Role must be TECHNICIAN, PATHOLOGIST, or QUALITY_MANAGER"
    );
  }

  // -----------------------------
  // Profile validation
  // -----------------------------

  if (typeof profile !== "object" || Array.isArray(profile)) {
    errors.push("Profile must be an object");
  }

  if (role === "TECHNICIAN") {
    if (!profile.employeeId || !String(profile.employeeId).trim()) {
      errors.push("Employee ID is required for technicians");
    }

    if (!profile.qualification || !String(profile.qualification).trim()) {
      errors.push("Qualification is required for technicians");
    }
  }

  if (role === "PATHOLOGIST") {
    if (
      !profile.medicalRegistrationId ||
      !String(profile.medicalRegistrationId).trim()
    ) {
      errors.push(
        "Medical Registration ID is required for pathologists"
      );
    }

    if (!profile.qualification || !String(profile.qualification).trim()) {
      errors.push("Qualification is required for pathologists");
    }

    if (
      !profile.specialization ||
      !String(profile.specialization).trim()
    ) {
      errors.push("Specialization is required for pathologists");
    }
  }

  if (role === "QUALITY_MANAGER") {
    if (!profile.employeeId || !String(profile.employeeId).trim()) {
      errors.push("Employee ID is required for quality managers");
    }

    if (!profile.qualification || !String(profile.qualification).trim()) {
      errors.push("Qualification is required for quality managers");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Registration validation failed",
      errors,
    });
  }

  // -----------------------------
  // Normalize request data
  // -----------------------------

  req.body.name = String(name).trim();
  req.body.email = String(email).trim().toLowerCase();
  req.body.phone = String(phone).trim();
  req.body.department = String(department).trim();

  if (profile.employeeId) {
    req.body.profile.employeeId = String(profile.employeeId).trim();
  }

  if (profile.medicalRegistrationId) {
    req.body.profile.medicalRegistrationId =
      String(profile.medicalRegistrationId).trim();
  }

  if (profile.qualification) {
    req.body.profile.qualification =
      String(profile.qualification).trim();
  }

  if (profile.specialization) {
    req.body.profile.specialization =
      String(profile.specialization).trim();
  }

  next();
};

const validateLogin = (req, res, next) => {
  const {
    identifier,
    password,
    accountType = "internal",
  } = req.body;

  const errors = [];

  if (!identifier || !String(identifier).trim()) {
    errors.push("Identifier is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (accountType !== "internal") {
    errors.push("Account type must be internal");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Login validation failed",
      errors,
    });
  }

  req.body.identifier = String(identifier).trim();

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
