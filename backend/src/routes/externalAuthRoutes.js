const express = require("express");

const {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
} = require("../controllers/externalAuthController");

const router = express.Router();

// PATIENT
router.post("/patient/register", registerPatient);
router.post("/patient/login", loginPatient);

// DOCTOR
router.post("/doctor/register", registerDoctor);
router.post("/doctor/login", loginDoctor);

module.exports = router;
