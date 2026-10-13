const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const { approveUser, rejectUser } = require("./userController");

const originals = { findById: User.findById, auditCreate: AuditLog.create, notificationUpdate: Notification.updateOne };
afterEach(() => {
  User.findById = originals.findById;
  AuditLog.create = originals.auditCreate;
  Notification.updateOne = originals.notificationUpdate;
});
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("staff approval records actor/action and creates an account-scoped notification", async () => {
  let audit;
  let notice;
  const account = { _id: "staff-id", role: "TECHNICIAN", status: "PENDING_APPROVAL", department: "Histology", save: async () => {} };
  User.findById = async () => account;
  AuditLog.create = async (value) => { audit = value; return value; };
  Notification.updateOne = async (filter, update) => { notice = { filter, update }; };
  const res = response();
  await approveUser({ params: { userId: "staff-id" }, user: { id: "admin-id" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(audit.performedBy, "admin-id");
  assert.equal(audit.action, "APPROVE");
  assert.deepEqual(audit.newData, { status: "ACTIVE", role: "TECHNICIAN" });
  assert.equal(notice.update.$setOnInsert.recipient, "staff-id");
  assert.equal(notice.update.$setOnInsert.recipientModel, "User");
});

test("failed account save emits no approval audit or notification", async () => {
  let eventCount = 0;
  User.findById = async () => ({ _id: "staff-id", role: "TECHNICIAN", status: "PENDING_APPROVAL", save: async () => { throw new Error("synthetic write failure"); } });
  AuditLog.create = async () => { eventCount += 1; };
  Notification.updateOne = async () => { eventCount += 1; };
  const originalError = console.error;
  console.error = () => {};
  try {
    const res = response();
    await approveUser({ params: { userId: "staff-id" }, user: { id: "admin-id" } }, res);
    assert.equal(res.statusCode, 500);
    assert.equal(eventCount, 0);
  } finally {
    console.error = originalError;
  }
});

test("staff rejection uses a rejection audit action after the status save", async () => {
  let audit;
  const account = { _id: "staff-id", role: "PATHOLOGIST", status: "PENDING_APPROVAL", department: "Pathology", save: async () => {} };
  User.findById = async () => account;
  AuditLog.create = async (value) => { audit = value; return value; };
  Notification.updateOne = async () => {};
  const res = response();
  await rejectUser({ params: { userId: "staff-id" }, user: { id: "admin-id" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(account.status, "INACTIVE");
  assert.equal(audit.action, "REJECT");
});
