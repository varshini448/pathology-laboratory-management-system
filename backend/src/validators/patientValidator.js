const validatePatient = (req, res, next) => {
  const {
    patientId,
    name,
    phone,
    password,
    dateOfBirth,
    gender,
    email,
    bloodGroup,
    abhaId,
    status,
  } = req.body;

  const errors = [];

  if (!patientId || !String(patientId).trim()) {
    errors.push("Patient ID is required");
  } else if (!/^[A-Za-z0-9_-]+$/.test(String(patientId).trim())) {
    errors.push(
      "Patient ID may contain only letters, numbers, hyphens, and underscores"
    );
  }

  if (!name || !String(name).trim()) {
    errors.push("Patient name is required");
  } else if (String(name).trim().length < 2) {
    errors.push("Patient name must contain at least 2 characters");
  }

  if (!phone || !String(phone).trim()) {
    errors.push("Phone number is required");
  } else if (!/^\+91[6-9]\d{9}$/.test(String(phone).trim())) {
    errors.push(
      "Please enter a valid Indian phone number in +91XXXXXXXXXX format"
    );
  }

  if (!password || !String(password).trim()) {
    errors.push("Password is required");
  } else if (String(password).length < 8) {
    errors.push("Password must contain at least 8 characters");
  }

  if (gender && !["MALE", "FEMALE", "OTHER"].includes(gender)) {
    errors.push("Gender must be MALE, FEMALE, or OTHER");
  }

  if (email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(String(email).trim())) {
      errors.push("Please enter a valid email address");
    }
  }

  if (dateOfBirth && Number.isNaN(Date.parse(dateOfBirth))) {
    errors.push("Invalid date of birth");
  }

  if (status && !["ACTIVE", "INACTIVE", "SUSPENDED"].includes(status)) {
    errors.push("Status must be ACTIVE, INACTIVE, or SUSPENDED");
  }

  if (abhaId && String(abhaId).trim().length > 50) {
    errors.push("ABHA ID cannot exceed 50 characters");
  }

  if (bloodGroup && String(bloodGroup).trim().length > 10) {
    errors.push("Blood group cannot exceed 10 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Patient validation failed",
      errors,
    });
  }

  req.body.patientId = String(patientId).trim();
  req.body.name = String(name).trim();
  req.body.phone = String(phone).trim();

  if (email) {
    req.body.email = String(email).trim().toLowerCase();
  }

  if (bloodGroup) {
    req.body.bloodGroup = String(bloodGroup).trim().toUpperCase();
  }

  if (abhaId) {
    req.body.abhaId = String(abhaId).trim();
  }

  next();
};

module.exports = {
  validatePatient,
};
