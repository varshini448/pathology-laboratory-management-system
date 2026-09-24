const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const generateToken = (id, userType) => {
  return jwt.sign(
    {
      id: id.toString(),
      userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// ================================
// PATIENT REGISTRATION
// ================================

const registerPatient = async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      abhaId,
      password,
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, phone and password are required",
      });
    }

    const normalizedPhone = phone.trim();

    const phoneRegex = /^\+91[6-9]\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return res.status(400).json({
        message:
          "Please enter a valid Indian phone number in +91XXXXXXXXXX format",
      });
    }

    const normalizedEmail = email
      ? email.trim().toLowerCase()
      : undefined;

    const existingPatient = await Patient.findOne({
      $or: [
        { phone: normalizedPhone },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
    });

    if (existingPatient) {
      return res.status(400).json({
        message: "A patient account with this phone or email already exists",
      });
    }

    if (abhaId) {
      const existingAbha = await Patient.findOne({
        abhaId: abhaId.trim(),
      });

      if (existingAbha) {
        return res.status(400).json({
          message: "This ABHA ID is already registered",
        });
      }
    }

    const patientCount = await Patient.countDocuments();

    const patientId = `PAT-${String(patientCount + 1).padStart(5, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      patientId,
      name: name.trim(),
      dateOfBirth: dateOfBirth || undefined,
      gender,
      phone: normalizedPhone,
      email: normalizedEmail,
      address: address ? address.trim() : undefined,
      bloodGroup: bloodGroup ? bloodGroup.trim() : undefined,
      abhaId: abhaId ? abhaId.trim() : undefined,
      password: hashedPassword,
      status: "ACTIVE",
    });

    return res.status(201).json({
      message: "Patient registration successful",
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        status: patient.status,
        userType: "PATIENT",
      },
    });
  } catch (error) {
    console.error("Patient registration error:", error);

    return res.status(500).json({
      message: "Patient registration failed",
      error: error.message,
    });
  }
};

// ================================
// PATIENT LOGIN
// ================================

const loginPatient = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required",
      });
    }

    const normalizedIdentifier = identifier.trim();

    const patient = await Patient.findOne({
      $or: [
        { email: normalizedIdentifier.toLowerCase() },
        { phone: normalizedIdentifier },
        { patientId: normalizedIdentifier },
        { abhaId: normalizedIdentifier },
      ],
    });

    if (!patient) {
      return res.status(401).json({
        message: "Invalid patient identifier or password",
      });
    }

    if (patient.status === "INACTIVE") {
      return res.status(403).json({
        message: "Your patient account is inactive",
      });
    }

    if (patient.status === "SUSPENDED") {
      return res.status(403).json({
        message: "Your patient account has been suspended",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      patient.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid patient identifier or password",
      });
    }

    patient.lastLogin = new Date();

    await patient.save();

    const token = generateToken(patient._id, "PATIENT");

    return res.status(200).json({
      message: "Patient login successful",
      token,
      user: {
        id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        status: patient.status,
        userType: "PATIENT",
      },
    });
  } catch (error) {
    console.error("Patient login error:", error);

    return res.status(500).json({
      message: "Patient login failed",
      error: error.message,
    });
  }
};

// ================================
// DOCTOR REGISTRATION
// ================================

const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      medicalRegistrationId,
      registrationAuthority,
      qualification,
      specialization,
      hospital,
      hospitalAddress,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !medicalRegistrationId ||
      !registrationAuthority ||
      !qualification ||
      !specialization ||
      !password
    ) {
      return res.status(400).json({
        message: "Please provide all required doctor registration fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedMedicalId = medicalRegistrationId.trim();

    const phoneRegex = /^\+91[6-9]\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return res.status(400).json({
        message:
          "Please enter a valid Indian phone number in +91XXXXXXXXXX format",
      });
    }

    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
        { medicalRegistrationId: normalizedMedicalId },
      ],
    });

    if (existingDoctor) {
      return res.status(400).json({
        message:
          "A doctor account with this email, phone or medical registration ID already exists",
      });
    }

    const doctorCount = await Doctor.countDocuments();

    const doctorId = `DOC-${String(doctorCount + 1).padStart(5, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      doctorId,
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      medicalRegistrationId: normalizedMedicalId,
      registrationAuthority: registrationAuthority.trim(),
      qualification: qualification.trim(),
      specialization: specialization.trim(),
      hospital: hospital ? hospital.trim() : undefined,
      hospitalAddress: hospitalAddress
        ? hospitalAddress.trim()
        : undefined,
      password: hashedPassword,
      status: "PENDING_VERIFICATION",
    });

    return res.status(201).json({
      message:
        "Doctor registration submitted successfully. Verification is required before login.",
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        status: doctor.status,
        userType: "DOCTOR",
      },
    });
  } catch (error) {
    console.error("Doctor registration error:", error);

    return res.status(500).json({
      message: "Doctor registration failed",
      error: error.message,
    });
  }
};

// ================================
// DOCTOR LOGIN
// ================================

const loginDoctor = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required",
      });
    }

    const normalizedIdentifier = identifier.trim();

    const doctor = await Doctor.findOne({
      $or: [
        { email: normalizedIdentifier.toLowerCase() },
        { phone: normalizedIdentifier },
        { doctorId: normalizedIdentifier },
        { medicalRegistrationId: normalizedIdentifier },
      ],
    });

    if (!doctor) {
      return res.status(401).json({
        message: "Invalid doctor identifier or password",
      });
    }

    if (doctor.status === "PENDING_VERIFICATION") {
      return res.status(403).json({
        message:
          "Your doctor account is pending professional verification.",
      });
    }

    if (doctor.status === "INACTIVE") {
      return res.status(403).json({
        message: "Your doctor account is inactive.",
      });
    }

    if (doctor.status === "SUSPENDED") {
      return res.status(403).json({
        message: "Your doctor account has been suspended.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      doctor.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid doctor identifier or password",
      });
    }

    doctor.lastLogin = new Date();

    await doctor.save();

    const token = generateToken(doctor._id, "DOCTOR");

    return res.status(200).json({
      message: "Doctor login successful",
      token,
      user: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        status: doctor.status,
        userType: "DOCTOR",
      },
    });
  } catch (error) {
    console.error("Doctor login error:", error);

    return res.status(500).json({
      message: "Doctor login failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
};
