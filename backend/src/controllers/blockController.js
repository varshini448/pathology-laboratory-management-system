const Block = require("../models/Block");
const Case = require("../models/Case");
const Specimen = require("../models/Specimen");
const { createAuditEntry } = require("../services/lifecycleEventService");

const sameId = (left, right) => String(left?._id || left) === String(right?._id || right);

const getBlockError = (error, fallback) => {
  if (error.code === 11000) return { status: 409, message: "A block with this identifier already exists." };
  if (["ValidationError", "CastError"].includes(error.name)) {
    return { status: 400, message: "Block information is invalid." };
  }
  return { status: 500, message: fallback };
};

const createBlock = async (req, res) => {
  try {
    const { blockId, specimen: specimenId, case: caseId, blockType, tissueDescription, notes } = req.body;
    const [caseData, specimen] = await Promise.all([
      Case.findById(caseId).select("_id"),
      Specimen.findById(specimenId).select("_id case"),
    ]);

    if (!caseData || !specimen) {
      return res.status(404).json({ message: !caseData ? "Case not found" : "Specimen not found" });
    }
    if (!sameId(specimen.case, caseData._id)) {
      return res.status(400).json({ message: "Specimen does not belong to this case" });
    }

    const block = await Block.create({
      blockId,
      specimen: specimenId,
      case: caseId,
      blockType,
      tissueDescription,
      notes,
      createdBy: req.user.id,
    });
    await createAuditEntry({
      req, action: "CREATE", module: "Blocks", resourceType: "Block", resourceId: block._id,
      description: "Block created", newData: { blockId: block.blockId, case: String(block.case), specimen: String(block.specimen), processingStatus: block.processingStatus },
    });

    res.status(201).json({
      message: "Block created successfully",
      block,
    });
  } catch (error) {
    const response = getBlockError(error, "Failed to create block.");
    return res.status(response.status).json({ message: response.message });
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
    return res.status(500).json({ message: "Failed to fetch blocks." });
  }
};

const getBlocksByCase = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      caseId: req.params.caseId,
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const blocks = await Block.find({
      case: caseData._id,
    })
      .populate("specimen", "specimenId specimenType status")
      .populate("case", "caseId caseType priority status")
      .sort({ createdAt: -1 });

    res.json({
      blocks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blocks for case." });
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
    const response = getBlockError(error, "Failed to fetch block.");
    return res.status(response.status).json({ message: response.message });
  }
};

const updateBlock = async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);

    if (!block) {
      return res.status(404).json({
        message: "Block not found",
      });
    }

    const previousData = { processingStatus: block.processingStatus };
    for (const field of ["blockType", "tissueDescription", "notes"]) {
      if (req.body[field] !== undefined) block[field] = req.body[field];
    }
    await block.save();
    await createAuditEntry({
      req, action: "UPDATE", module: "Blocks", resourceType: "Block", resourceId: block._id,
      description: "Block updated", previousData, newData: { processingStatus: block.processingStatus },
    });

    res.json({
      message: "Block updated successfully",
      block,
    });
  } catch (error) {
    const response = getBlockError(error, "Failed to update block.");
    return res.status(response.status).json({ message: response.message });
  }
};

module.exports = {
  createBlock,
  getBlocks,
  getBlocksByCase,
  getBlockById,
  updateBlock,
};
