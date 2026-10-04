const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getAuditLogsController,
  getAuditLogsByResourceController,
} = require("../controllers/auditController");

const router = express.Router();

// Audit logs are restricted to administrative and quality roles.
router.get(
  "/",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER"),
  getAuditLogsController
);

// Resource-specific audit history.
router.get(
  "/resource/:resourceType/:resourceId",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER"),
  getAuditLogsByResourceController
);

module.exports = router;