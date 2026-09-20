const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createWorkflowEvent,
  getWorkflowEventsByCase,
} = require("../controllers/workflowController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN", "TECHNICIAN", "PATHOLOGIST"),
  createWorkflowEvent
);

router.get(
  "/case/:caseId",
  protect,
  authorize(
    "ADMIN",
    "TECHNICIAN",
    "PATHOLOGIST",
    "QUALITY_MANAGER"
  ),
  getWorkflowEventsByCase
);

module.exports = router;