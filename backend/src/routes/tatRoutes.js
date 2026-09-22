const express = require("express");

const {
  getCaseTAT,
  getAllCaseTAT,
  getStageTAT,
} = require("../controllers/tatController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getAllCaseTAT
);

router.get(
  "/case/:caseId",
  authMiddleware,
  roleMiddleware("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getCaseTAT
);

router.get(
  "/case/:caseId/stages",
  authMiddleware,
  roleMiddleware("ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"),
  getStageTAT
);

module.exports = router;