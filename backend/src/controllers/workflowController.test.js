const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const workflowService = require("../services/workflowService");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { createWorkflowEvent } = require("./workflowController");

const originals = { createWorkflowEvent: workflowService.createWorkflowEvent, auditCreate: AuditLog.create, userFind: User.find, notificationUpdate: Notification.updateOne };
afterEach(() => {
  workflowService.createWorkflowEvent = originals.createWorkflowEvent;
  AuditLog.create = originals.auditCreate;
  User.find = originals.userFind;
  Notification.updateOne = originals.notificationUpdate;
});
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("completed scanning event is audited and signals active pathologists", async () => {
  let audit;
  let roleFilter;
  let notification;
  workflowService.createWorkflowEvent = async (value) => ({ ...value, _id: "event-id", case: "case-id", slide: "slide-id", stage: "SCANNING", status: "COMPLETED" });
  AuditLog.create = async (value) => { audit = value; return value; };
  User.find = (filter) => { roleFilter = filter; return { select: async () => [{ _id: "pathologist-id" }] }; };
  Notification.updateOne = async (filter, update) => { notification = { filter, update }; };
  const res = response();
  await createWorkflowEvent({ user: { id: "technician-id" }, body: { case: "case-id", stage: "SCANNING", status: "COMPLETED" }, ip: "127.0.0.1" }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(audit.performedBy, "technician-id");
  assert.equal(audit.newData.stage, "SCANNING");
  assert.deepEqual(roleFilter, { role: { $in: ["PATHOLOGIST"] }, status: "ACTIVE" });
  assert.equal(notification.update.$setOnInsert.type, "WORKFLOW_ALERT");
});

test("failed workflow transition emits neither success audit nor notification", async () => {
  let eventWrites = 0;
  workflowService.createWorkflowEvent = async () => { throw Object.assign(new Error("invalid transition"), { statusCode: 400 }); };
  AuditLog.create = async () => { eventWrites += 1; };
  User.find = () => { eventWrites += 1; return { select: async () => [] }; };
  Notification.updateOne = async () => { eventWrites += 1; };
  const originalError = console.error;
  console.error = () => {};
  try {
    const res = response();
    await createWorkflowEvent({ user: { id: "technician-id" }, body: { case: "case-id", stage: "SCANNING", status: "INVALID" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(eventWrites, 0);
  } finally {
    console.error = originalError;
  }
});
