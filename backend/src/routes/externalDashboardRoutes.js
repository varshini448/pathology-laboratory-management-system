const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireExternalUserType = require("../middleware/externalDashboardAuth");
const {
  getPatientDashboard,
  getDoctorDashboard,
} = require("../controllers/externalDashboardController");

const router = express.Router();

router.get(
  "/patient",
  protect,
  requireExternalUserType("PATIENT"),
  getPatientDashboard
);

router.get(
  "/doctor",
  protect,
  requireExternalUserType("DOCTOR"),
  getDoctorDashboard
);

module.exports = router;
