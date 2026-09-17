const Case = require("../models/Case");

const createCase = async (req, res) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create case",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
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
    res.status(500).json({
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};

const updateCase = async (req, res) => {
  try {
    const caseData = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    res.status(500).json({
      message: "Failed to update case",
      error: error.message,
    });
  }
};

module.exports = {
  createCase,
  getCases,
  getCaseById,
  updateCase,
};