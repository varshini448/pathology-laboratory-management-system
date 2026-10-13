const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const Notification = require("../models/Notification");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { getNotifications, markNotificationAsRead, createNotification } = require("./notificationController");

const originals = { find: Notification.find, countDocuments: Notification.countDocuments, findOneAndUpdate: Notification.findOneAndUpdate, create: Notification.create, patientExists: Patient.exists, doctorExists: Doctor.exists, userExists: User.exists };
afterEach(() => { Notification.find = originals.find; Notification.countDocuments = originals.countDocuments; Notification.findOneAndUpdate = originals.findOneAndUpdate; Notification.create = originals.create; Patient.exists = originals.patientExists; Doctor.exists = originals.doctorExists; User.exists = originals.userExists; });
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("notification list and unread count are scoped to the authenticated recipient", async () => {
  const queries = [];
  Notification.find = (query) => {
    queries.push(query);
    return { sort() { return this; }, skip() { return this; }, limit() { return Promise.resolve([]); } };
  };
  Notification.countDocuments = async (query) => { queries.push(query); return 0; };
  const res = response();
  await getNotifications({ user: { id: "user-1" }, query: {} }, res);
  const internalRecipient = { recipient: "user-1", $or: [{ recipientModel: "User" }, { recipientModel: { $exists: false } }] };
  assert.deepEqual(queries, [internalRecipient, internalRecipient, { ...internalRecipient, isRead: false }]);
  assert.equal(res.body.unreadCount, 0);
});

test("mark-as-read updates only the notification owned by the authenticated recipient", async () => {
  let criteria;
  Notification.findOneAndUpdate = async (query, update, options) => {
    criteria = query;
    assert.deepEqual(update, { isRead: true, readAt: update.readAt });
    assert.ok(update.readAt instanceof Date);
    assert.deepEqual(options, { new: true });
    return { _id: "note-1", recipient: "user-1", isRead: true };
  };
  const res = response();
  await markNotificationAsRead({ user: { id: "user-1" }, params: { id: "note-1" } }, res);
  assert.deepEqual(criteria, { _id: "note-1", recipient: "user-1", $or: [{ recipientModel: "User" }, { recipientModel: { $exists: false } }] });
  assert.equal(res.body.notification.isRead, true);
});

test("external notification reads are scoped to the authenticated external model", async () => {
  let filter;
  Notification.find = (query) => {
    filter = query;
    return { sort() { return this; }, skip() { return this; }, limit: async () => [] };
  };
  Notification.countDocuments = async () => 0;
  const res = response();
  await getNotifications({ user: { id: "shared-id", userType: "DOCTOR" }, query: {} }, res);
  assert.deepEqual(filter, { recipient: "shared-id", recipientModel: "Doctor" });
  assert.equal(res.statusCode, 200);
});

test("notification creation rejects an unsupported recipient model before writing", async () => {
  let called = false;
  Notification.create = async () => { called = true; };
  const res = response();
  await createNotification({
    user: { id: "admin-id" },
    body: { recipient: "recipient-id", recipientModel: "Secrets", title: "x", message: "y", type: "INFO" },
  }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(called, false);
});

test("authorized notification creation validates and preserves the recipient model", async () => {
  let created;
  Patient.exists = async (filter) => { assert.deepEqual(filter, { _id: "patient-id" }); return true; };
  Notification.create = async (value) => { created = value; return { _id: "notification-id", ...value }; };
  const res = response();
  await createNotification({
    user: { id: "admin-id" },
    body: { recipient: "patient-id", recipientModel: "Patient", title: "Report ready", message: "A report is available.", type: "REPORT_ALERT" },
  }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(created.recipient, "patient-id");
  assert.equal(created.recipientModel, "Patient");
});
