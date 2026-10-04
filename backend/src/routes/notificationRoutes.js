const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

// Get notifications for the logged-in user.
router.get("/", protect, getNotifications);

// Create system notifications.
// Restricted to administrative/quality roles.
router.post(
  "/",
  protect,
  authorize("ADMIN", "QUALITY_MANAGER"),
  createNotification
);

// Mark one notification as read.
router.put("/:id/read", protect, markNotificationAsRead);

// Mark all notifications as read.
router.put("/read-all", protect, markAllNotificationsAsRead);

module.exports = router;