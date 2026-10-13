const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const User = require("../models/User");
const service = require("./lifecycleEventService");

const originals = {
  auditCreate: AuditLog.create,
  notificationUpdate: Notification.updateOne,
  userFind: User.find,
};
afterEach(() => {
  AuditLog.create = originals.auditCreate;
  Notification.updateOne = originals.notificationUpdate;
  User.find = originals.userFind;
});

test("audit events record actor and target metadata without expanding request payloads", async () => {
  let entry;
  AuditLog.create = async (value) => { entry = value; return value; };
  const req = { user: { id: "staff-id" }, ip: "127.0.0.1", get: (header) => header === "user-agent" ? "test-agent" : undefined };
  await service.createAuditEntry({
    req,
    action: "SIGN_OUT",
    module: "Reports",
    resourceType: "Report",
    resourceId: "report-id",
    description: "Report finalized",
    previousData: { reportStatus: "DRAFT" },
    newData: { reportStatus: "FINAL" },
  });
  assert.equal(entry.performedBy, "staff-id");
  assert.equal(entry.resourceId, "report-id");
  assert.equal(entry.ipAddress, "127.0.0.1");
  assert.equal(entry.userAgent, "test-agent");
  assert.equal(JSON.stringify(entry).includes("password"), false);
});

test("notifications are deduplicated per event and recipient model", async () => {
  const queries = [];
  Notification.updateOne = async (filter, update, options) => {
    queries.push({ filter, update, options });
  };
  await service.notifyRecipients({
    recipients: [
      { id: "shared-id", model: "User" },
      { id: "shared-id", model: "Doctor" },
      { id: "shared-id", model: "User" },
      { id: "bad-id", model: "Unrecognized" },
    ],
    eventKey: "report-final:r-1",
    title: "Report ready",
    message: "A finalized report is available.",
    type: "REPORT_ALERT",
    resourceType: "Report",
    resourceId: "r-1",
  });
  assert.equal(queries.length, 2);
  assert.deepEqual(queries.map(({ filter }) => filter), [
    { dedupeKey: "report-final:r-1:User:shared-id" },
    { dedupeKey: "report-final:r-1:Doctor:shared-id" },
  ]);
  assert.equal(queries.every(({ options }) => options.upsert && options.setDefaultsOnInsert), true);
  assert.equal(queries[0].update.$setOnInsert.recipientModel, "User");
  assert.equal(queries[1].update.$setOnInsert.recipientModel, "Doctor");
});

test("role notifications target only active users in the requested roles", async () => {
  let criteria;
  User.find = (filter) => {
    criteria = filter;
    return { select: async () => [{ _id: "qm-id" }] };
  };
  Notification.updateOne = async () => {};
  await service.notifyActiveRoles({
    roles: ["QUALITY_MANAGER"],
    eventKey: "qc-needs-review:qc-1",
    title: "QC review needed",
    message: "A QC decision needs review.",
  });
  assert.deepEqual(criteria, { role: { $in: ["QUALITY_MANAGER"] }, status: "ACTIVE" });
});

test("notification failures are contained after successful lifecycle changes", async () => {
  Notification.updateOne = async () => { throw new Error("synthetic notification storage error"); };
  const originalError = console.error;
  console.error = () => {};
  try {
    await assert.doesNotReject(service.notifyWithoutBlocking({
      recipients: [{ id: "user-id", model: "User" }],
      eventKey: "case-assigned:case-1",
      title: "Case assigned",
      message: "A case was assigned.",
    }));
  } finally {
    console.error = originalError;
  }
});
