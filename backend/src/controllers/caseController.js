const Case = require("../models/Case");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const getCaseError = (error, fallback) => {
  if (error.code === 11000) return { status: 409, message: "A case with this identifier already exists." };
  if (["ValidationError", "CastError"].includes(error.name)) {
    return { status: 400, message: "Case information is invalid." };
  }
  return { status: 500, message: fallback };
};

const createCase = async (req, res) => {
  try {
    const { caseId, patient, doctor, caseType, clinicalHistory, priority } = req.body;
    const [patientExists, doctorExists] = await Promise.all([
      Patient.exists({ _id: patient }),
      Doctor.exists({ _id: doctor }),
    ]);

    if (!patientExists || !doctorExists) {
      return res.status(404).json({
        message: !patientExists ? "Patient not found" : "Doctor not found",
      });
    }

    const newCase = await Case.create({
      caseId,
      patient,
      doctor,
      caseType,
      clinicalHistory,
      priority,
      status: "REGISTERED",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error) {
    const response = getCaseError(error, "Failed to create case.");
    return res.status(response.status).json({ message: response.message });
  }
};

const getCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .sort({ createdAt: -1 });

    res.json({
      cases,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cases." });
  }
};

const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({ caseId: req.params.id })
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization");

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.json({
      case: caseData,
    });
  } catch (error) {
    const response = getCaseError(error, "Failed to fetch case.");
    return res.status(response.status).json({ message: response.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const caseData = await Case.findByIdAndUpdate(
      req.params.id,
      {
        caseType: req.body.caseType,
        clinicalHistory: req.body.clinicalHistory,
        priority: req.body.priority,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.json({
      message: "Case updated successfully",
      case: caseData,
    });
  } catch (error) {
    const response = getCaseError(error, "Failed to update case.");
    return res.status(response.status).json({ message: response.message });
  }
};

module.exports = {
  createCase,
  getCases,
  getCaseById,
  updateCase,
};
