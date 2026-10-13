const Doctor = require("../models/Doctor");
const { createAuditEntry, notifyWithoutBlocking } = require("../services/lifecycleEventService");

// GET PENDING DOCTORS
const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      status: "PENDING_VERIFICATION",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Pending doctors fetched successfully",
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get pending doctors error:", error);

    return res.status(500).json({
      message: "Failed to fetch pending doctors",
      error: error.message,
    });
  }
};

// APPROVE DOCTOR
const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (doctor.status !== "PENDING_VERIFICATION") {
      return res.status(400).json({
        message: `Doctor is not pending verification. Current status: ${doctor.status}`,
      });
    }

    const previousStatus = doctor.status;
    doctor.status = "ACTIVE";

    await doctor.save();
    await createAuditEntry({
      req, action: "VERIFY", module: "Doctor Verification", resourceType: "Doctor", resourceId: doctor._id,
      description: "Doctor account verified and approved", previousData: { status: previousStatus },
      newData: { status: doctor.status },
    });
    await notifyWithoutBlocking({
      recipients: [{ id: doctor._id, model: "Doctor" }],
      eventKey: `doctor-approved:${doctor._id}`,
      title: "Your doctor account was verified",
      message: "You can now sign in to your doctor dashboard.",
      type: "SUCCESS",
      module: "Doctor Verification",
      resourceType: "Doctor",
      resourceId: doctor._id,
      actionUrl: "/login",
    });

    return res.status(200).json({
      message: "Doctor verified and approved successfully",
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        medicalRegistrationId: doctor.medicalRegistrationId,
        status: doctor.status,
        userType: "DOCTOR",
      },
    });
  } catch (error) {
    console.error("Approve doctor error:", error);

    return res.status(500).json({
      message: "Failed to approve doctor",
      error: error.message,
    });
  }
};

// REJECT DOCTOR
const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (doctor.status !== "PENDING_VERIFICATION") {
      return res.status(400).json({
        message: `Doctor is not pending verification. Current status: ${doctor.status}`,
      });
    }

    const previousStatus = doctor.status;
    doctor.status = "INACTIVE";

    await doctor.save();
    await createAuditEntry({
      req, action: "REJECT", module: "Doctor Verification", resourceType: "Doctor", resourceId: doctor._id,
      description: "Doctor account verification rejected", previousData: { status: previousStatus },
      newData: { status: doctor.status },
    });
    await notifyWithoutBlocking({
      recipients: [{ id: doctor._id, model: "Doctor" }],
      eventKey: `doctor-rejected:${doctor._id}`,
      title: "Your doctor account request was declined",
      message: "Your doctor account request was declined. Contact the laboratory administrator for assistance.",
      type: "WARNING",
      module: "Doctor Verification",
      resourceType: "Doctor",
      resourceId: doctor._id,
      actionUrl: "/login",
    });

    return res.status(200).json({
      message: "Doctor verification rejected",
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        medicalRegistrationId: doctor.medicalRegistrationId,
        status: doctor.status,
        userType: "DOCTOR",
      },
    });
  } catch (error) {
    console.error("Reject doctor error:", error);

    return res.status(500).json({
      message: "Failed to reject doctor",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
};
