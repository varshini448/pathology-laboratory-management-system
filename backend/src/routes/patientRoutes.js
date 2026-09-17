const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
} = require("../controllers/patientController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  createPatient
);

router.get(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getPatients
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getPatientById
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  updatePatient
);

module.exports = router;