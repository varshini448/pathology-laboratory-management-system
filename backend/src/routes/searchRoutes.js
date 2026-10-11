const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { searchCases } = require("../controllers/searchController");

const router = express.Router();
router.get("/", protect, authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"), searchCases);

module.exports = router;
