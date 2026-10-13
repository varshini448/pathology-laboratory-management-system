const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const User = require("../models/User");

const createAuditEntry = async ({
  req,
  action,
  module,
  resourceType,
  resourceId,
  description,
  previousData = null,
  newData = null,
}) => AuditLog.create({
  performedBy: req.user.id,
  action,
  module,
  resourceType,
  resourceId: resourceId ? String(resourceId) : undefined,
  description,
  previousData,
  newData,
  ipAddress: req.ip,
  userAgent: req.get?.("user-agent"),
});

const notifyRecipients = async ({
  recipients,
  eventKey,
  title,
  message,
  type = "INFO",
  priority = "MEDIUM",
  module,
  resourceType,
  resourceId,
  actionUrl,
}) => {
  const uniqueRecipients = new Map();
  for (const recipient of recipients || []) {
    if (!recipient?.id || !["User", "Doctor", "Patient"].includes(recipient.model)) continue;
    uniqueRecipients.set(`${recipient.model}:${recipient.id}`, recipient);
  }

  await Promise.all([...uniqueRecipients.values()].map(({ id, model }) => {
    const dedupeKey = `${eventKey}:${model}:${id}`;
    return Notification.updateOne(
      { dedupeKey },
      {
        $setOnInsert: {
          recipient: id,
          recipientModel: model,
          dedupeKey,
          title,
          message,
          type,
          priority,
          module,
          resourceType,
          resourceId: resourceId ? String(resourceId) : undefined,
          actionUrl,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }));
};

const notifyActiveRoles = async (args) => {
  const users = await User.find({ role: { $in: args.roles }, status: "ACTIVE" }).select("_id");
  return notifyRecipients({ ...args, recipients: users.map(({ _id }) => ({ id: _id, model: "User" })) });
};

const notifyWithoutBlocking = async (args) => {
  try {
    await notifyRecipients(args);
  } catch (error) {
    // Notification delivery is best-effort; the state change and its audit record remain authoritative.
    console.error("Lifecycle notification delivery failed:", error.message);
  }
};

const notifyRolesWithoutBlocking = async (args) => {
  try {
    await notifyActiveRoles(args);
  } catch (error) {
    console.error("Lifecycle role notification delivery failed:", error.message);
  }
};

module.exports = {
  createAuditEntry,
  notifyRecipients,
  notifyActiveRoles,
  notifyWithoutBlocking,
  notifyRolesWithoutBlocking,
};
