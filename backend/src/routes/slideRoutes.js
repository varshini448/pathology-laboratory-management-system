const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  uploadSlideImage: slideImageUpload,
  handleSlideUploadError,
} = require("../middleware/slideUploadMiddleware");
const {
  createSlide,
  getSlides,
  getSlidesByCase,
  getSlideById,
  updateSlide,
  uploadSlideImage,
  getSlideImage,
} = require("../controllers/slideController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  createSlide
);

router.get(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSlides
);

router.get(
  "/case/:caseId",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSlidesByCase
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSlideById
);

router.get(
  "/:id/image",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSlideImage
);
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST"),
  updateSlide
);

router.post(
  "/:id/image",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  slideImageUpload.single("image"),
  handleSlideUploadError,
  uploadSlideImage
);

module.exports = router;