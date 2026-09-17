const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
} = require("../controllers/doctorController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  createDoctor
);

router.get(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getDoctors
);

router.get(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getDoctorById
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "TECHNICIAN"),
  updateDoctor
);

module.exports = router;