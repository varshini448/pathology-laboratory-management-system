const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createQCRecord,
  getQCRecords,
  getQCRecordsByCase,
  getQCRecordById,
  updateQCRecord,
} = require("../controllers/qcController");

const router = express.Router();

// Create QC record
router.post(
  "/",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER", "PATHOLOGIST"),
  createQCRecord
);

// Get all QC records
router.get(
  "/",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER", "PATHOLOGIST", "TECHNICIAN"),
  getQCRecords
);

// Get QC records by case
router.get(
  "/case/:caseId",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER", "PATHOLOGIST", "TECHNICIAN"),
  getQCRecordsByCase
);

// Get QC record by ID
router.get(
  "/:id",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER", "PATHOLOGIST", "TECHNICIAN"),
  getQCRecordById
);

// Update QC record
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER", "PATHOLOGIST"),
  updateQCRecord
);

module.exports = router;