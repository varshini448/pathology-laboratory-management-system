const Notification = require("../models/Notification");
const NotificationRecipientModels = {
  User: require("../models/User"),
  Doctor: require("../models/Doctor"),
  Patient: require("../models/Patient"),
};

const getRecipientModel = (user) => {
  if (user?.userType === "DOCTOR") return "Doctor";
  if (user?.userType === "PATIENT") return "Patient";
  return "User";
};

const recipientFilter = (user) => {
  const model = getRecipientModel(user);
  return model === "User"
    ? { recipient: user.id, $or: [{ recipientModel: "User" }, { recipientModel: { $exists: false } }] }
    : { recipient: user.id, recipientModel: model };
};

const getNotifications = async (req, res) => {
  try {
    const {
      isRead,
      type,
      priority,
      limit = 50,
      page = 1,
    } = req.query;

    const query = recipientFilter(req.user);

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    const parsedLimit = Math.min(Number(limit) || 50, 100);
    const parsedPage = Math.max(Number(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),

      Notification.countDocuments(query),

      Notification.countDocuments({ ...recipientFilter(req.user), isRead: false }),
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

const createNotification = async (req, res) => {
  try {
    const recipientModel = req.body.recipientModel || "User";
    if (!["User", "Doctor", "Patient"].includes(recipientModel)) {
      return res.status(400).json({ message: "Notification recipient type is invalid" });
    }
    const recipient = req.body.recipient || req.user.id;
    if (!await NotificationRecipientModels[recipientModel].exists({ _id: recipient })) {
      return res.status(404).json({ message: "Notification recipient not found" });
    }
    const notification = await Notification.create({
      ...req.body,
      recipient,
      recipientModel,
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, ...recipientFilter(req.user) },
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { ...recipientFilter(req.user), isRead: false },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    res.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
