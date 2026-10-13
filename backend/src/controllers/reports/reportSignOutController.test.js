const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const Report = require("../../models/Report");
const AuditLog = require("../../models/AuditLog");
const Notification = require("../../models/Notification");
const { signOutReport } = require("./reportSignOutController");

const originals = { findById: Report.findById, auditCreate: AuditLog.create, notificationUpdate: Notification.updateOne };
afterEach(() => {
  Report.findById = originals.findById;
  AuditLog.create = originals.auditCreate;
  Notification.updateOne = originals.notificationUpdate;
});
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("report sign-out audits minimal metadata and notifies only linked external accounts", async () => {
  let lookups = 0;
  let audit;
  const notices = [];
  const report = {
    _id: "report-id",
    case: "case-id",
    diagnosis: "synthetic sensitive diagnosis",
    reportStatus: "DRAFT",
    save: async function save() {},
  };
  const signedOutReport = {
    _id: "report-id",
    reportStatus: "FINAL",
    case: { _id: "case-id", doctor: { _id: "doctor-id" }, patient: { _id: "patient-id" } },
  };
  Report.findById = () => {
    lookups += 1;
    if (lookups === 1) return Promise.resolve(report);
    return {
      populate() { return this; },
      then(resolve, reject) { return Promise.resolve(signedOutReport).then(resolve, reject); },
    };
  };
  AuditLog.create = async (value) => { audit = value; return value; };
  Notification.updateOne = async (filter, update) => notices.push({ filter, update });

  const res = response();
  await signOutReport({ params: { id: "report-id" }, user: { id: "pathologist-id" }, ip: "127.0.0.1", get: () => "test-agent" }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(report.reportStatus, "FINAL");
  assert.equal(audit.performedBy, "pathologist-id");
  assert.equal(audit.action, "SIGN_OUT");
  assert.equal(audit.resourceId, "report-id");
  assert.equal(JSON.stringify(audit).includes("synthetic sensitive diagnosis"), false);
  assert.deepEqual(notices.map(({ update }) => update.$setOnInsert.recipientModel).sort(), ["Doctor", "Patient"]);
  assert.equal(notices.every(({ update }) => !JSON.stringify(update).includes("synthetic sensitive diagnosis")), true);
});

test("report without a diagnosis cannot sign out or emit success events", async () => {
  let eventWrites = 0;
  Report.findById = async () => ({ _id: "report-id", reportStatus: "DRAFT", diagnosis: " ", save: async () => {} });
  AuditLog.create = async () => { eventWrites += 1; };
  Notification.updateOne = async () => { eventWrites += 1; };
  const res = response();
  await signOutReport({ params: { id: "report-id" }, user: { id: "pathologist-id" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(eventWrites, 0);
});
