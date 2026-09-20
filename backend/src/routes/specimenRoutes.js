const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createSpecimen,
  getSpecimens,
  getSpecimensByCase,
  getSpecimenById,
  updateSpecimen,
} = require("../controllers/specimenController");

const router = express.Router();

// Get all specimens
router.get(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSpecimens
);

// Create specimen
router.post(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  createSpecimen
);

// Get specimens by case
router.get(
  "/case/:caseId",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSpecimensByCase
);

// Get specimen by ID
router.get(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getSpecimenById
);

// Update specimen
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST"),
  updateSpecimen
);

module.exports = router;