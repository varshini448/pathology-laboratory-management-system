const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const Case = require("../models/Case");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const { createCase } = require("./caseController");

const originals = {
  caseCreate: Case.create,
  patientExists: Patient.exists,
  doctorExists: Doctor.exists,
  auditCreate: AuditLog.create,
  notificationUpdate: Notification.updateOne,
};
afterEach(() => {
  Case.create = originals.caseCreate;
  Patient.exists = originals.patientExists;
  Doctor.exists = originals.doctorExists;
  AuditLog.create = originals.auditCreate;
  Notification.updateOne = originals.notificationUpdate;
});

const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test("case creation audits assignment and notifies only the assigned doctor without patient details", async () => {
  let audit;
  const notices = [];
  Patient.exists = async () => true;
  Doctor.exists = async () => true;
  Case.create = async (value) => ({ ...value, _id: "case-document-id", status: "REGISTERED" });
  AuditLog.create = async (value) => { audit = value; return value; };
  Notification.updateOne = async (filter, update) => notices.push({ filter, update });

  const res = response();
  await createCase({
    user: { id: "technician-id" },
    ip: "127.0.0.1",
    get: () => "synthetic-agent",
    body: { caseId: "CASE-SAFE-1", patient: "patient-id", doctor: "doctor-id", caseType: "Biopsy", clinicalHistory: "private fixture text", priority: "NORMAL" },
  }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(audit.performedBy, "technician-id");
  assert.deepEqual(audit.newData, { caseId: "CASE-SAFE-1", doctor: "doctor-id", patient: "patient-id", status: "REGISTERED" });
  assert.equal(JSON.stringify(audit).includes("private fixture text"), false);
  assert.equal(notices.length, 1);
  assert.equal(notices[0].update.$setOnInsert.recipientModel, "Doctor");
  assert.equal(notices[0].update.$setOnInsert.message.includes("patient"), false);
});

test("a failed case write creates neither an audit success entry nor a notification", async () => {
  let eventCount = 0;
  Patient.exists = async () => true;
  Doctor.exists = async () => true;
  Case.create = async () => { throw Object.assign(new Error("duplicate"), { code: 11000 }); };
  AuditLog.create = async () => { eventCount += 1; };
  Notification.updateOne = async () => { eventCount += 1; };
  const res = response();
  await createCase({ user: { id: "technician-id" }, body: { caseId: "CASE-DUP", patient: "p", doctor: "d", caseType: "Biopsy" } }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(eventCount, 0);
});
