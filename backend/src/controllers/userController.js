const User = require("../models/User");

// GET PENDING APPROVALS
const getPendingApprovals = async (req, res) => {
  try {
    const users = await User.find({
      status: "PENDING_APPROVAL",
    })
      .select("name email role status department profile.employeeId profile.medicalRegistrationId createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Pending approvals fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get pending approvals error:", error);

    return res.status(500).json({
      message: "Failed to fetch pending approvals",
    });
  }
};

 // GET ALL USERS FOR ADMIN DIRECTORY
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email phone department role status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users: users.map((user) => ({
        ...user,
        id: user._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// APPROVE USER
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "Admin accounts cannot be approved through this endpoint",
      });
    }

    if (user.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        message: `User is not pending approval. Current status: ${user.status}`,
      });
    }

    user.status = "ACTIVE";

    await user.save();

    return res.status(200).json({
      message: "User approved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Approve user error:", error);

    return res.status(500).json({
      message: "Failed to approve user",
    });
  }
};

// REJECT USER
const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "Admin accounts cannot be rejected through this endpoint",
      });
    }

    if (user.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        message: `User is not pending approval. Current status: ${user.status}`,
      });
    }

    user.status = "INACTIVE";

    await user.save();

    return res.status(200).json({
      message: "User rejected successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Reject user error:", error);

    return res.status(500).json({
      message: "Failed to reject user",
    });
  }
};


module.exports = {
  getAllUsers,
  getPendingApprovals,
  approveUser,
  rejectUser,
};
