const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile route accessed successfully",
    user: req.user,
  });
});

router.get("/admin", protect, authorize("ADMIN"), (req, res) => {
  res.json({
    message: "Admin route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
