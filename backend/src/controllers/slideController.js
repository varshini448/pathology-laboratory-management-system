const Slide = require("../models/Slide");

const createSlide = async (req, res) => {
  try {
    const slide = await Slide.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Slide created successfully",
      slide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create slide",
      error: error.message,
    });
  }
};

const getSlides = async (req, res) => {
  try {
    const slides = await Slide.find()
      .populate("block", "blockId blockType processingStatus")
      .populate("case", "caseId caseType priority status")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      slides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch slides",
      error: error.message,
    });
  }
};

const getSlidesByCase = async (req, res) => {
  try {
    const slides = await Slide.find({ case: req.params.caseId })
      .populate("block", "blockId blockType processingStatus")
      .populate("case", "caseId caseType priority status")
      .sort({ createdAt: -1 });

    res.json({
      slides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch slides for case",
      error: error.message,
    });
  }
};

const getSlideById = async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id)
      .populate("block", "blockId blockType processingStatus")
      .populate("case", "caseId caseType priority status")
      .populate("createdBy", "name email role");

    if (!slide) {
      return res.status(404).json({
        message: "Slide not found",
      });
    }

    res.json({
      slide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch slide",
      error: error.message,
    });
  }
};

const updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!slide) {
      return res.status(404).json({
        message: "Slide not found",
      });
    }

    res.json({
      message: "Slide updated successfully",
      slide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update slide",
      error: error.message,
    });
  }
};

module.exports = {
  createSlide,
  getSlides,
  getSlidesByCase,
  getSlideById,
  updateSlide,
};