const Case = require("../models/Case");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { createAuditEntry, notifyWithoutBlocking } = require("../services/lifecycleEventService");

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
      Patient.exists({ _id: patient, status: "ACTIVE" }),
      Doctor.exists({ _id: doctor, status: "ACTIVE" }),
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

    await createAuditEntry({
      req,
      action: "CREATE",
      module: "Cases",
      resourceType: "Case",
      resourceId: newCase._id,
      description: "Case created and assigned",
      newData: { caseId: newCase.caseId, doctor: String(newCase.doctor), patient: String(newCase.patient), status: newCase.status },
    });
    await notifyWithoutBlocking({
      recipients: [{ id: newCase.doctor, model: "Doctor" }],
      eventKey: `case-assigned:${newCase._id}`,
      title: "A case was assigned to you",
      message: "A new case is available in your doctor dashboard.",
      type: "CASE_ALERT",
      module: "Cases",
      resourceType: "Case",
      resourceId: newCase._id,
      actionUrl: "/doctor-dashboard",
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
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const previousData = {
      caseType: caseData.caseType,
      priority: caseData.priority,
      doctor: String(caseData.doctor),
      patient: String(caseData.patient),
      status: caseData.status,
    };
    if (req.body.caseType !== undefined) caseData.caseType = req.body.caseType;
    if (req.body.clinicalHistory !== undefined) caseData.clinicalHistory = req.body.clinicalHistory;
    if (req.body.priority !== undefined) caseData.priority = req.body.priority;
    const doctorChanged = req.body.doctor !== undefined && req.body.doctor !== String(caseData.doctor);
    if (doctorChanged) {
      if (!await Doctor.exists({ _id: req.body.doctor, status: "ACTIVE" })) return res.status(404).json({ message: "Active doctor not found" });
      caseData.doctor = req.body.doctor;
    }
    await caseData.save();
    await createAuditEntry({
      req,
      action: "UPDATE",
      module: "Cases",
      resourceType: "Case",
      resourceId: caseData._id,
      description: doctorChanged ? "Case assignment updated" : "Case details updated",
      previousData,
      newData: { caseType: caseData.caseType, priority: caseData.priority, doctor: String(caseData.doctor), patient: String(caseData.patient), status: caseData.status },
    });
    if (doctorChanged) {
      await notifyWithoutBlocking({
        recipients: [{ id: caseData.doctor, model: "Doctor" }],
        eventKey: `case-assigned:${caseData._id}:${String(caseData.doctor)}`,
        title: "A case was assigned to you",
        message: "A case is available in your doctor dashboard.",
        type: "CASE_ALERT",
        module: "Cases",
        resourceType: "Case",
        resourceId: caseData._id,
        actionUrl: "/doctor-dashboard",
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
