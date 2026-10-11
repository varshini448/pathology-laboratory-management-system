const test = require("node:test");
const assert = require("node:assert/strict");
const { validatePatient } = require("./patientValidator");
const Patient = require("../models/Patient");

const runValidator = (body) => {
  const req = { body: { ...body } };
  let response;
  let continued = false;
  const res = {
    status(statusCode) {
      response = { statusCode };
      return this;
    },
    json(data) {
      response.data = data;
      return this;
    },
  };

  validatePatient(req, res, () => { continued = true; });
  return { req, response, continued };
};

test("patient record validation normalizes age and local Indian phone numbers", () => {
  const { req, continued, response } = runValidator({
    patientId: " PAT_001 ",
    name: " Patient One ",
    age: "42",
    gender: "OTHER",
    phone: "9876543210",
  });

  assert.equal(continued, true);
  assert.equal(response, undefined);
  assert.equal(req.body.patientId, "PAT_001");
  assert.equal(req.body.name, "Patient One");
  assert.equal(req.body.age, 42);
  assert.equal(req.body.phone, "+919876543210");
});

test("patient record validation rejects malformed identifiers, ages, and phone numbers", () => {
  const { continued, response } = runValidator({
    patientId: "bad id",
    name: "A",
    age: "42.5",
    gender: "UNKNOWN",
    phone: "123",
  });

  assert.equal(continued, false);
  assert.equal(response.statusCode, 400);
  assert.equal(response.data.errors.length >= 4, true);
});

test("patient passwords are optional for lab records and excluded from default reads", () => {
  const passwordPath = Patient.schema.path("password");

  assert.notEqual(passwordPath.isRequired, true);
  assert.equal(passwordPath.options.select, false);
});
