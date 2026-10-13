const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const QCRecord = require("../models/QCRecord");
const Case = require("../models/Case");
const Slide = require("../models/Slide");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { createQCRecord } = require("./qcController");

const originals = {
  qcCreate: QCRecord.create, qcFindById: QCRecord.findById,
  caseFindById: Case.findById, slideFindById: Slide.findById,
  auditCreate: AuditLog.create, notificationUpdate: Notification.updateOne, userFind: User.find,
};
afterEach(() => {
  QCRecord.create = originals.qcCreate;
  QCRecord.findById = originals.qcFindById;
  Case.findById = originals.caseFindById;
  Slide.findById = originals.slideFindById;
  AuditLog.create = originals.auditCreate;
  Notification.updateOne = originals.notificationUpdate;
  User.find = originals.userFind;
});
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("review-needed QC records an audit decision and notifies only active quality managers", async () => {
  let audit;
  let roleFilter;
  let notification;
  Case.findById = () => ({ select: async () => ({ _id: "case-id" }) });
  Slide.findById = () => ({ select: async () => ({ _id: "slide-id", case: "case-id" }) });
  QCRecord.create = async (value) => ({ ...value, _id: "qc-id" });
  QCRecord.findById = () => ({
    populate() { return this; },
    then(resolve, reject) { return Promise.resolve({ _id: "qc-id" }).then(resolve, reject); },
  });
  AuditLog.create = async (value) => { audit = value; return value; };
  User.find = (query) => { roleFilter = query; return { select: async () => [{ _id: "qm-id" }] }; };
  Notification.updateOne = async (filter, update) => { notification = { filter, update }; };

  const res = response();
  await createQCRecord({
    user: { id: "pathologist-id" },
    ip: "127.0.0.1",
    body: { qcId: "QC-TEST-1", case: "case-id", slide: "slide-id", sectionQuality: "POOR", stainingQuality: "GOOD", labelingCheck: "PASS", documentationCheck: "PASS", overallStatus: "NEEDS_REVIEW", findings: "Synthetic fixture finding" },
  }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(audit.performedBy, "pathologist-id");
  assert.deepEqual(audit.newData, { qcId: "QC-TEST-1", case: "case-id", slide: "slide-id", overallStatus: "NEEDS_REVIEW" });
  assert.deepEqual(roleFilter, { role: { $in: ["QUALITY_MANAGER"] }, status: "ACTIVE" });
  assert.equal(notification.update.$setOnInsert.type, "QC_ALERT");
  assert.equal(notification.update.$setOnInsert.message.includes("Synthetic"), false);
});

test("QC relationship failure creates no audit or notification event", async () => {
  let eventWrites = 0;
  Case.findById = () => ({ select: async () => ({ _id: "case-id" }) });
  Slide.findById = () => ({ select: async () => ({ _id: "slide-id", case: "other-case-id" }) });
  AuditLog.create = async () => { eventWrites += 1; };
  Notification.updateOne = async () => { eventWrites += 1; };
  const res = response();
  await createQCRecord({ user: { id: "pathologist-id" }, body: { case: "case-id", slide: "slide-id" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(eventWrites, 0);
});
