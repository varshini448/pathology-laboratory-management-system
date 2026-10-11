const Patient = require("../models/Patient");

const PATIENT_FIELDS = [
  "patientId",
  "name",
  "age",
  "dateOfBirth",
  "gender",
  "phone",
  "email",
  "address",
  "bloodGroup",
  "abhaId",
];

const getPatientFields = (body) => Object.fromEntries(
  PATIENT_FIELDS
    .filter((field) => body[field] !== undefined && body[field] !== "")
    .map((field) => [field, body[field]])
);

const getPatientResponse = (patient) => patient?.toObject
  ? patient.toObject()
  : patient;

const getPatientError = (error, fallback) => {
  if (error.code === 11000) {
    return { status: 409, message: "A patient with this ID, phone, or email already exists." };
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Patient information is invalid." };
  }

  return { status: 500, message: fallback };
};

const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({
      ...getPatientFields(req.body),
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Patient created successfully",
      patient: getPatientResponse(patient),
    });
  } catch (error) {
    const response = getPatientError(error, "Failed to create patient.");
    return res.status(response.status).json({ message: response.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      patients: patients.map(getPatientResponse),
    });
  } catch (error) {
    const response = getPatientError(error, "Failed to fetch patients.");
    return res.status(response.status).json({ message: response.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.json({
      patient: getPatientResponse(patient),
    });
  } catch (error) {
    const response = getPatientError(error, "Failed to fetch patient.");
    return res.status(response.status).json({ message: response.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      getPatientFields(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.json({
      message: "Patient updated successfully",
      patient: getPatientResponse(patient),
    });
  } catch (error) {
    const response = getPatientError(error, "Failed to update patient.");
    return res.status(response.status).json({ message: response.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
};
