const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const Case = require("../models/Case");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { searchCases, escapeRegex } = require("./searchController");

const originals = { caseFind: Case.find, patientFind: Patient.find, doctorFind: Doctor.find };
afterEach(() => { Case.find = originals.caseFind; Patient.find = originals.patientFind; Doctor.find = originals.doctorFind; });

const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
const idsQuery = (items) => ({ select() { return this; }, limit() { return Promise.resolve(items); } });

test("rejects short and overlong search input before database reads", async () => {
  let called = false;
  Patient.find = () => { called = true; };
  const res = response();
  await searchCases({ query: { q: "x" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(called, false);
});

test("escapes user search text before constructing a regular expression", () => {
  assert.equal(escapeRegex("A+B (test)"), "A\\+B \\(test\\)");
});

test("returns only case links and minimal case context matching authorized directory terms", async () => {
  let caseQuery;
  Patient.find = () => idsQuery([{ _id: "patient-1" }]);
  Doctor.find = () => idsQuery([{ _id: "doctor-1" }]);
  Case.find = (query) => {
    caseQuery = query;
    return {
      select() { return this; }, populate() { return this; }, sort() { return this; },
      limit() { return Promise.resolve([{ _id: "case-1", caseId: "CASE-10", caseType: "Biopsy", status: "IN_PROCESS", patient: { name: "Patient One" } }]); },
    };
  };
  const res = response();
  await searchCases({ query: { q: "Patient" } }, res);
  assert.deepEqual(caseQuery.$or[1], { patient: { $in: ["patient-1"] } });
  assert.deepEqual(res.body.results, [{ type: "CASE", id: "case-1", label: "CASE-10", description: "Patient One · Biopsy · IN_PROCESS", href: "/cases/CASE-10" }]);
});
