const Block = require("../models/Block");

const createBlock = async (req, res) => {
  try {
    const block = await Block.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Block created successfully",
      block,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create block",
      error: error.message,
    });
  }
};

const getBlocks = async (req, res) => {
  try {
    const blocks = await Block.find()
      .populate("specimen", "specimenId specimenType status")
      .populate("case", "caseId caseType priority status")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      blocks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blocks",
      error: error.message,
    });
  }
};

const getBlocksByCase = async (req, res) => {
  try {
    const blocks = await Block.find({ case: req.params.caseId })
      .populate("specimen", "specimenId specimenType status")
      .populate("case", "caseId caseType priority status")
      .sort({ createdAt: -1 });

    res.json({
      blocks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blocks for case",
      error: error.message,
    });
  }
};

const getBlockById = async (req, res) => {
  try {
    const block = await Block.findById(req.params.id)
      .populate("specimen", "specimenId specimenType status")
      .populate("case", "caseId caseType priority status")
      .populate("createdBy", "name email role");

    if (!block) {
      return res.status(404).json({
        message: "Block not found",
      });
    }

    res.json({
      block,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch block",
      error: error.message,
    });
  }
};

const updateBlock = async (req, res) => {
  try {
    const block = await Block.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!block) {
      return res.status(404).json({
        message: "Block not found",
      });
    }

    res.json({
      message: "Block updated successfully",
      block,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update block",
      error: error.message,
    });
  }
};

module.exports = {
  createBlock,
  getBlocks,
  getBlocksByCase,
  getBlockById,
  updateBlock,
};