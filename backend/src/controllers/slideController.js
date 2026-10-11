const Slide = require("../models/Slide");
const Block = require("../models/Block");
const Case = require("../models/Case");
const fs = require("fs/promises");
const path = require("path");
const {
  uploadDirectory,
} = require("../middleware/slideUploadMiddleware");
const hasValidImageSignature = async (filePath, contentType) => {
  const handle = await fs.open(filePath, "r");

  try {
    const buffer = Buffer.alloc(12);
    const { bytesRead } = await handle.read(buffer, 0, 12, 0);
    const header = buffer.subarray(0, bytesRead);

    if (contentType === "image/jpeg") {
      return header.length >= 3 &&
        header[0] === 0xff &&
        header[1] === 0xd8 &&
        header[2] === 0xff;
    }

    if (contentType === "image/png") {
      return header.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      );
    }

    if (contentType === "image/webp") {
      return header.length >= 12 &&
        header.toString("ascii", 0, 4) === "RIFF" &&
        header.toString("ascii", 8, 12) === "WEBP";
    }

    return false;
  } finally {
    await handle.close();
  }
};

const getStoredImagePath = (filename) => {
  if (typeof filename !== "string" || path.basename(filename) !== filename) {
    return null;
  }

  const imagePath = path.resolve(uploadDirectory, filename);
  return imagePath.startsWith(`${uploadDirectory}${path.sep}`)
    ? imagePath
    : null;
};

const createSlide = async (req, res) => {
  try {
    const { slideId, block: blockId, case: caseId, slideType, stainingMethod, notes } = req.body;
    const [caseData, block] = await Promise.all([
      Case.findById(caseId).select("_id"),
      Block.findById(blockId).select("_id case"),
    ]);

    if (!caseData || !block) {
      return res.status(404).json({ message: !caseData ? "Case not found" : "Block not found" });
    }
    if (String(block.case?._id || block.case) !== String(caseData._id)) {
      return res.status(400).json({ message: "Block does not belong to this case" });
    }

    const slide = await Slide.create({
      slideId,
      block: blockId,
      case: caseId,
      slideType,
      stainingMethod,
      notes,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Slide created successfully",
      slide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create slide",
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
    });
  }
};

const getSlidesByCase = async (req, res) => {
  try {
    const Case = require("../models/Case");

    const caseData = await Case.findOne({
      caseId: req.params.caseId,
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const slides = await Slide.find({
      case: caseData._id,
    })
      .populate("block", "blockId blockType processingStatus")
      .populate("case", "caseId caseType priority status")
      .sort({ createdAt: -1 });

    res.json({
      slides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch slides for case",
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
    });
  }
};

const updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      {
        slideType: req.body.slideType,
        stainingMethod: req.body.stainingMethod,
        notes: req.body.notes,
      },
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
    });
  }
};


const uploadSlideImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a JPEG, PNG, or WebP image.",
      });
    }

    const validImage = await hasValidImageSignature(
      req.file.path,
      req.file.mimetype
    );

    if (!validImage) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        message: "The uploaded file does not match a supported image format.",
      });
    }

    const slide = await Slide.findById(req.params.id);

    if (!slide) {
      await fs.unlink(req.file.path).catch(() => {});

      return res.status(404).json({
        message: "Slide not found.",
      });
    }

    // Replace an existing uploaded image only after finding the slide.
    const previousFilename = slide.image?.filename;

    slide.image = {
      filename: req.file.filename,
      contentType: req.file.mimetype,
      uploadedAt: new Date(),
      size: req.file.size,
    };

    await slide.save();

    if (previousFilename && previousFilename !== req.file.filename) {
      const previousPath = getStoredImagePath(previousFilename);
      if (previousPath) await fs.unlink(previousPath).catch(() => {});
    }

    return res.json({
      message: "Slide image uploaded successfully.",
      slide,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    return res.status(500).json({
      message: "Failed to upload slide image.",
    });
  }
};
const getSlideImage = async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);

    if (!slide || !slide.image?.filename) {
      return res.status(404).json({
        message: "No image found for this slide.",
      });
    }

    const imagePath = getStoredImagePath(slide.image.filename);

    if (!imagePath) {
      return res.status(400).json({
        message: "Invalid image filename.",
      });
    }

    res.set("X-Content-Type-Options", "nosniff");
    res.set("Cache-Control", "private, no-store");

    return res.sendFile(imagePath, (error) => {
      if (error && !res.headersSent) {
        res.status(error.statusCode === 404 ? 404 : 500).json({
          message: "Unable to retrieve slide image.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve slide image.",
    });
  }
};
module.exports = {
  createSlide,
  getSlides,
  getSlidesByCase,
  getSlideById,
  updateSlide,
  uploadSlideImage,
  getSlideImage,
};
