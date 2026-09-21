const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  generateReportData,
  createReport,
  getReports,
  getReportsByCase,
  getReportById,
  updateReport,
} = require("../controllers/reportController");

const router = express.Router();

// Generate report data automatically from a case
router.get(
  "/generate/:caseId",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  generateReportData
);

// Create a report
router.post(
  "/",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  createReport
);

// Get all reports
router.get(
  "/",
  protect,
  authorize("ADMIN", "PATHOLOGIST", "QUALITY_MANAGER", "TECHNICIAN"),
  getReports
);

// Get reports for a specific case
router.get(
  "/case/:caseId",
  protect,
  authorize("ADMIN", "PATHOLOGIST", "QUALITY_MANAGER", "TECHNICIAN"),
  getReportsByCase
);

// Get a specific report
router.get(
  "/:id",
  protect,
  authorize("ADMIN", "PATHOLOGIST", "QUALITY_MANAGER", "TECHNICIAN"),
  getReportById
);

// Update / finalize a report
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  updateReport
);

module.exports = router;