const Doctor = require("../models/Doctor");

const getDoctorResponse = (doctor) => {
  if (!doctor) return doctor;
  const data = doctor.toObject ? doctor.toObject() : { ...doctor };
  delete data.password;
  delete data.lastLogin;
  delete data.createdBy;
  return data;
};

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: getDoctorResponse(doctor),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create doctor",
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password -lastLogin -createdBy").sort({ createdAt: -1 });

    res.json({
      doctors: doctors.map(getDoctorResponse),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password -lastLogin -createdBy");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      doctor: getDoctorResponse(doctor),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor",
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      message: "Doctor updated successfully",
      doctor: getDoctorResponse(doctor),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update doctor",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorResponse,
};
