const express = require("express");

const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
} = require("../controllers/doctorVerificationController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ADMIN ONLY
router.get(
  "/pending",
  protect,
  authorize("ADMIN"),
  getPendingDoctors
);

// ADMIN ONLY
router.put(
  "/:doctorId/approve",
  protect,
  authorize("ADMIN"),
  approveDoctor
);

// ADMIN ONLY
router.put(
  "/:doctorId/reject",
  protect,
  authorize("ADMIN"),
  rejectDoctor
);

module.exports = router;