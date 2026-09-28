const express = require("express");

const {
  requestEmailVerification,
  verifyEmail,
} = require("../controllers/emailVerificationController");

const router = express.Router();

router.post("/request", requestEmailVerification);
router.post("/verify", verifyEmail);

module.exports = router;
