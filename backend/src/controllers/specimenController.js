const Specimen = require("../models/Specimen");

const createSpecimen = async (req, res) => {
  try {
    const specimen = await Specimen.create({
      ...req.body,
      collectedBy: req.user.id,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Specimen created successfully",
      specimen,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create specimen",
      error: error.message,
    });
  }
};

const getSpecimens = async (req, res) => {
  try {
    const specimens = await Specimen.find()
      .populate("case", "caseId caseType priority status")
      .populate("collectedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      specimens,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch specimens",
      error: error.message,
    });
  }
};

const getSpecimenById = async (req, res) => {
  try {
    const specimen = await Specimen.findById(req.params.id)
      .populate("case", "caseId caseType priority status")
      .populate("collectedBy", "name email role");

    if (!specimen) {
      return res.status(404).json({
        message: "Specimen not found",
      });
    }

    res.json({
      specimen,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch specimen",
      error: error.message,
    });
  }
};

const updateSpecimen = async (req, res) => {
  try {
    const specimen = await Specimen.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!specimen) {
      return res.status(404).json({
        message: "Specimen not found",
      });
    }

    res.json({
      message: "Specimen updated successfully",
      specimen,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update specimen",
      error: error.message,
    });
  }
};

module.exports = {
  createSpecimen,
  getSpecimens,
  getSpecimenById,
  updateSpecimen,
};