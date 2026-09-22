
const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  generateReportData,
} = require("../controllers/reports/reportDataController");

const {
  createReport,
  getReports,
  getReportsByCase,
  getReportById,
  updateReport,
} = require("../controllers/reports/reportController");

const {
  getPendingSignOutReports,
  signOutReport,
} = require("../controllers/reports/reportSignOutController");

const router = express.Router();

// Generate report data from a case
router.get(
  "/generate/:caseId",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  generateReportData
);

// Create report draft
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
  authorize(
    "ADMIN",
    "PATHOLOGIST",
    "QUALITY_MANAGER",
    "TECHNICIAN"
  ),
  getReports
);

// Get reports pending final sign-out
router.get(
  "/pending-sign-out",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  getPendingSignOutReports
);

// Get reports by case
router.get(
  "/case/:caseId",
  protect,
  authorize(
    "ADMIN",
    "PATHOLOGIST",
    "QUALITY_MANAGER",
    "TECHNICIAN"
  ),
  getReportsByCase
);

// Final sign-out
router.post(
  "/:id/sign-out",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  signOutReport
);

// Get single report
router.get(
  "/:id",
  protect,
  authorize(
    "ADMIN",
    "PATHOLOGIST",
    "QUALITY_MANAGER",
    "TECHNICIAN"
  ),
  getReportById
);

// Update draft report
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "PATHOLOGIST"),
  updateReport
);

module.exports = router;