const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
} = require("../controllers/caseController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  createCase
);

router.get(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getCases
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getCaseById
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST"),
  updateCase
);

module.exports = router;