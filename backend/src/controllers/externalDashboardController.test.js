const test = require("node:test");
const assert = require("node:assert/strict");

const Case = require("../models/Case");
const Report = require("../models/Report");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const {
  getPatientDashboard,
  getDoctorDashboard,
} = require("./externalDashboardController");

const query = (value) => ({
  select() { return this; },
  populate() { return this; },
  sort() { return Promise.resolve(value); },
});

const response = () => ({
  statusCode: 200,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test("patient dashboard uses the authenticated patient and only their final reports", async (t) => {
  const original = {
    patient: Patient.findById,
    cases: Case.find,
    reports: Report.find,
  };
  t.after(() => {
    Patient.findById = original.patient;
    Case.find = original.cases;
    Report.find = original.reports;
  });

  Patient.findById = (id) => {
    assert.equal(id, "patient-account-id");
    return { select: async () => ({ _id: id, patientId: "PAT-1", name: "Patient", status: "ACTIVE" }) };
  };
  Case.find = (filter) => {
    assert.deepEqual(filter, { patient: "patient-account-id" });
    return {
      select() { return this; }, populate() { return this; },
      sort: async () => [{ _id: "case-document-id", caseId: "CASE-1", status: "IN_PROCESS" }],
    };
  };
  Report.find = (filter) => {
    assert.deepEqual(filter, {
      case: { $in: ["case-document-id"] },
      reportStatus: "FINAL",
    });
    return query([{ _id: "report-1", reportStatus: "FINAL" }]);
  };

  const res = response();
  await getPatientDashboard({ user: { id: "patient-account-id" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.stats.totalCases, 1);
  assert.equal(res.body.reports.length, 1);
});

test("doctor dashboard scopes cases to the authenticated doctor and queries final reports only", async (t) => {
  const original = {
    doctor: Doctor.findById,
    cases: Case.find,
    reports: Report.find,
  };
  t.after(() => {
    Doctor.findById = original.doctor;
    Case.find = original.cases;
    Report.find = original.reports;
  });

  Doctor.findById = (id) => {
    assert.equal(id, "doctor-account-id");
    return { select: async () => ({ _id: id, doctorId: "DOC-1", name: "Doctor", status: "ACTIVE" }) };
  };
  Case.find = (filter) => {
    assert.deepEqual(filter, { doctor: "doctor-account-id" });
    return {
      select() { return this; }, populate() { return this; },
      sort: async () => [{ _id: "case-document-id", caseId: "CASE-1", status: "IN_PROCESS" }],
    };
  };
  Report.find = (filter) => {
    assert.deepEqual(filter, {
      case: { $in: ["case-document-id"] },
      reportStatus: "FINAL",
    });
    return query([{ _id: "report-1", reportStatus: "FINAL" }]);
  };

  const res = response();
  await getDoctorDashboard({ user: { id: "doctor-account-id" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.stats.assignedCases, 1);
  assert.equal(res.body.stats.finalReports, 1);
});
