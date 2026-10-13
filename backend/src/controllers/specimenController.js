const Specimen = require("../models/Specimen");
const Case = require("../models/Case");
const { createAuditEntry } = require("../services/lifecycleEventService");

const getSpecimenError = (error, fallback) => {
  if (error.code === 11000) return { status: 409, message: "A specimen with this identifier already exists." };
  if (["ValidationError", "CastError"].includes(error.name)) {
    return { status: 400, message: "Specimen information is invalid." };
  }
  return { status: 500, message: fallback };
};

const createSpecimen = async (req, res) => {
  try {
    const { specimenId, case: caseId, specimenType, collectionSite, collectionDate, receivedDate, condition, notes } = req.body;
    if (!await Case.exists({ _id: caseId })) {
      return res.status(404).json({ message: "Case not found" });
    }

    const specimen = await Specimen.create({
      specimenId,
      case: caseId,
      specimenType,
      collectionSite,
      collectionDate,
      receivedDate,
      condition,
      notes,
      collectedBy: req.user.id,
      createdBy: req.user.id,
    });
    await createAuditEntry({
      req, action: "CREATE", module: "Specimens", resourceType: "Specimen", resourceId: specimen._id,
      description: "Specimen created", newData: { specimenId: specimen.specimenId, case: String(specimen.case), status: specimen.status },
    });

    res.status(201).json({
      message: "Specimen created successfully",
      specimen,
    });
  } catch (error) {
    const response = getSpecimenError(error, "Failed to create specimen.");
    return res.status(response.status).json({ message: response.message });
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
    return res.status(500).json({ message: "Failed to fetch specimens." });
  }
};

const getSpecimensByCase = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      caseId: req.params.caseId,
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const specimens = await Specimen.find({
      case: caseData._id,
    })
      .populate("case", "caseId caseType priority status")
      .populate("collectedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      specimens,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch specimens for case." });
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
    const response = getSpecimenError(error, "Failed to fetch specimen.");
    return res.status(response.status).json({ message: response.message });
  }
};

const updateSpecimen = async (req, res) => {
  try {
    const specimen = await Specimen.findById(req.params.id);

    if (!specimen) {
      return res.status(404).json({
        message: "Specimen not found",
      });
    }

    const previousData = { status: specimen.status, condition: specimen.condition };
    for (const field of ["specimenType", "collectionSite", "collectionDate", "receivedDate", "condition", "notes"]) {
      if (req.body[field] !== undefined) specimen[field] = req.body[field];
    }
    await specimen.save();
    await createAuditEntry({
      req, action: "UPDATE", module: "Specimens", resourceType: "Specimen", resourceId: specimen._id,
      description: "Specimen updated", previousData,
      newData: { status: specimen.status, condition: specimen.condition },
    });

    res.json({
      message: "Specimen updated successfully",
      specimen,
    });
  } catch (error) {
    const response = getSpecimenError(error, "Failed to update specimen.");
    return res.status(response.status).json({ message: response.message });
  }
};

module.exports = {
  createSpecimen,
  getSpecimens,
  getSpecimensByCase,
  getSpecimenById,
  updateSpecimen,
};
