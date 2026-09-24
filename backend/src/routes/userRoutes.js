const express = require("express");

const {
  getPendingApprovals,
  approveUser,
  rejectUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Protected profile route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile route accessed successfully",
    user: req.user,
  });
});

// Admin test route
router.get("/admin", protect, authorize("ADMIN"), (req, res) => {
  res.json({
    message: "Admin route accessed successfully",
    user: req.user,
  });
});

// ADMIN - GET PENDING APPROVALS
router.get(
  "/admin/pending-approvals",
  protect,
  authorize("ADMIN"),
  getPendingApprovals
);

// ADMIN - APPROVE USER
router.put(
  "/admin/users/:userId/approve",
  protect,
  authorize("ADMIN"),
  approveUser
);

// ADMIN - REJECT USER
router.put(
  "/admin/users/:userId/reject",
  protect,
  authorize("ADMIN"),
  rejectUser
);

module.exports = router;
