const Case = require("../models/Case");
const Report = require("../models/Report");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const ACTIVE_CASE_STATUSES = [
  "REGISTERED",
  "SPECIMEN_COLLECTED",
  "IN_PROCESS",
];

const serializeCase = (item) => ({
  _id: item._id,
  caseId: item.caseId,
  caseType: item.caseType,
  priority: item.priority,
  status: item.status,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  patient: item.patient
    ? {
        patientId: item.patient.patientId,
        name: item.patient.name,
      }
    : undefined,
  doctor: item.doctor
    ? {
        doctorId: item.doctor.doctorId,
        name: item.doctor.name,
        specialization: item.doctor.specialization,
      }
    : undefined,
});

const serializeReport = (item) => ({
  _id: item._id,
  reportId: item.reportId,
  case: item.case
    ? {
        _id: item.case._id,
        caseId: item.case.caseId,
      }
    : undefined,
  diagnosis: item.diagnosis,
  microscopicFindings: item.microscopicFindings,
  grossFindings: item.grossFindings,
  interpretation: item.interpretation,
  recommendations: item.recommendations,
  reportStatus: item.reportStatus,
  reviewedAt: item.reviewedAt,
  createdAt: item.createdAt,
});

const getPatientDashboard = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id)
      .select("_id patientId name status");

    if (!patient || patient.status !== "ACTIVE") {
      return res.status(403).json({
        message: "This patient account is unavailable.",
      });
    }

    const cases = await Case.find({ patient: patient._id })
      .select("caseId caseType priority status createdAt updatedAt patient doctor")
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .sort({ createdAt: -1 });

    const caseIds = cases.map((item) => item._id);

    const reports = caseIds.length
      ? await Report.find({
          case: { $in: caseIds },
          reportStatus: "FINAL",
        })
          .select(
            "reportId case diagnosis microscopicFindings grossFindings interpretation recommendations reportStatus reviewedAt createdAt"
          )
          .populate("case", "caseId")
          .sort({ reviewedAt: -1, createdAt: -1 })
      : [];

    return res.json({
      account: {
        patientId: patient.patientId,
        name: patient.name,
      },
      stats: {
        totalCases: cases.length,
        activeCases: cases.filter((item) =>
          ACTIVE_CASE_STATUSES.includes(item.status)
        ).length,
        finalReports: reports.length,
      },
      cases: cases.map(serializeCase),
      reports: reports.map(serializeReport),
    });
  } catch (error) {
    console.error("Patient dashboard error:", error);
    return res.status(500).json({
      message: "Unable to load the patient dashboard.",
    });
  }
};

const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id)
      .select("_id doctorId name specialization status");

    if (!doctor || doctor.status !== "ACTIVE") {
      return res.status(403).json({
        message: "This doctor account is not active.",
      });
    }

    const cases = await Case.find({ doctor: doctor._id })
      .select("caseId caseType priority status createdAt updatedAt patient doctor")
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .sort({ createdAt: -1 });

    const caseIds = cases.map((item) => item._id);

    const reports = caseIds.length
      ? await Report.find({ case: { $in: caseIds } })
          .select(
            "reportId case diagnosis microscopicFindings grossFindings interpretation recommendations reportStatus reviewedAt createdAt"
          )
          .populate("case", "caseId")
          .sort({ createdAt: -1 })
      : [];

    const patientIds = new Set(
      cases
        .filter((item) => item.patient?._id)
        .map((item) => item.patient._id.toString())
    );

    return res.json({
      account: {
        doctorId: doctor.doctorId,
        name: doctor.name,
        specialization: doctor.specialization,
      },
      stats: {
        assignedCases: cases.length,
        distinctPatients: patientIds.size,
        activeCases: cases.filter((item) =>
          ACTIVE_CASE_STATUSES.includes(item.status)
        ).length,
        finalReports: reports.filter(
          (item) => item.reportStatus === "FINAL"
        ).length,
      },
      cases: cases.map(serializeCase),
      reports: reports.map(serializeReport),
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    return res.status(500).json({
      message: "Unable to load the doctor dashboard.",
    });
  }
};

module.exports = {
  getPatientDashboard,
  getDoctorDashboard,
};
