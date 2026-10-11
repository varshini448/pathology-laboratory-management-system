const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { registerPatient, loginPatient, loginDoctor } = require("./externalAuthController");

const originalPatientFindOne = Patient.findOne;
const originalPatientCountDocuments = Patient.countDocuments;
const originalPatientCreate = Patient.create;
const originalDoctorFindOne = Doctor.findOne;
const originalJwtSecret = process.env.JWT_SECRET;
const testSecret = "external-auth-controller-test-secret";

const makeResponse = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test.beforeEach(() => {
  process.env.JWT_SECRET = testSecret;
});

test.afterEach(() => {
  Patient.findOne = originalPatientFindOne;
  Patient.countDocuments = originalPatientCountDocuments;
  Patient.create = originalPatientCreate;
  Doctor.findOne = originalDoctorFindOne;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
});

test("patient registration creates one hashed credential that can log in by normalized email", async () => {
  let persistedPatient;
  let hashCount = 0;
  Patient.findOne = async () => null;
  Patient.countDocuments = async () => 0;
  Patient.create = async (record) => {
    hashCount += 1;
    persistedPatient = {
      ...record,
      _id: "new-patient-test-id",
      save: async () => {},
    };
    return persistedPatient;
  };

  const registrationResponse = makeResponse();
  await registerPatient({ body: {
    name: "Test Patient",
    phone: "+919876543210",
    email: "Patient@Example.Test",
    password: "safe-test-password",
  } }, registrationResponse);

  assert.equal(registrationResponse.statusCode, 201);
  assert.equal(registrationResponse.body.patient.email, "patient@example.test");
  assert.equal("password" in registrationResponse.body.patient, false);
  assert.equal(hashCount, 1);
  assert.notEqual(persistedPatient.password, "safe-test-password");
  assert.equal(await bcrypt.compare("safe-test-password", persistedPatient.password), true);

  Patient.findOne = () => ({ select: async (field) => {
    assert.equal(field, "+password");
    return persistedPatient;
  } });
  const loginResponse = makeResponse();
  await loginPatient({ body: {
    identifier: "PATIENT@EXAMPLE.TEST",
    password: "safe-test-password",
  } }, loginResponse);

  assert.equal(loginResponse.statusCode, 200);
  assert.equal(loginResponse.body.user.id, persistedPatient._id);
  assert.equal(loginResponse.body.user.userType, "PATIENT");
});

test("public patient registration rejects an existing staff-created record without a password", async () => {
  let createCalled = false;
  Patient.findOne = async () => ({ _id: "existing-patient-test-id" });
  Patient.create = async () => {
    createCalled = true;
    throw new Error("should not create a duplicate");
  };

  const res = makeResponse();
  await registerPatient({ body: {
    name: "Existing Patient",
    phone: "+919876543210",
    email: "existing@example.test",
    password: "safe-test-password",
  } }, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /already exists/i);
  assert.equal(createCalled, false);
});

test("active patient login returns a PATIENT user and matching JWT", async () => {
  const passwordHash = await bcrypt.hash("safe-test-password", 4);
  const patient = {
    _id: "patient-test-id",
    patientId: "PAT-TEST",
    name: "Test Patient",
    email: "patient@example.test",
    phone: "+919876543210",
    status: "ACTIVE",
    password: passwordHash,
    save: async () => {},
  };
  Patient.findOne = () => ({ select: async (field) => {
    assert.equal(field, "+password");
    return patient;
  } });

  const res = makeResponse();
  await loginPatient({ body: { identifier: patient.patientId, password: "safe-test-password" } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.userType, "PATIENT");
  assert.equal(res.body.user.id, patient._id);
  assert.equal("password" in res.body.user, false);
  const claims = jwt.verify(res.body.token, testSecret);
  assert.equal(claims.id, patient._id);
  assert.equal(claims.userType, "PATIENT");
});

test("patient without a stored password receives an authentication error", async () => {
  const patient = { status: "ACTIVE", password: undefined };
  Patient.findOne = () => ({ select: async () => patient });

  const res = makeResponse();
  await loginPatient({ body: { identifier: "PAT-LEGACY", password: "safe-test-password" } }, res);

  assert.equal(res.statusCode, 401);
  assert.match(res.body.message, /invalid patient identifier or password/i);
});

test("active doctor login returns a DOCTOR user and matching JWT", async () => {
  const passwordHash = await bcrypt.hash("safe-test-password", 4);
  const doctor = {
    _id: "doctor-test-id",
    doctorId: "DOC-TEST",
    name: "Test Doctor",
    email: "doctor@example.test",
    status: "ACTIVE",
    password: passwordHash,
    save: async () => {},
  };
  Doctor.findOne = async () => doctor;

  const res = makeResponse();
  await loginDoctor({ body: { identifier: doctor.doctorId, password: "safe-test-password" } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.userType, "DOCTOR");
  assert.equal(res.body.user.id, doctor._id);
  assert.equal("password" in res.body.user, false);
  const claims = jwt.verify(res.body.token, testSecret);
  assert.equal(claims.id, doctor._id);
  assert.equal(claims.userType, "DOCTOR");
});

test("doctor awaiting verification is denied login", async () => {
  let passwordComparisonReached = false;
  Doctor.findOne = async () => ({
    status: "PENDING_VERIFICATION",
    password: "unused-test-hash",
  });

  const res = makeResponse();
  await loginDoctor({ body: { identifier: "DOC-PENDING", password: "safe-test-password" } }, res);
  passwordComparisonReached = res.statusCode === 200;

  assert.equal(passwordComparisonReached, false);
  assert.equal(res.statusCode, 403);
  assert.match(res.body.message, /pending professional verification/i);
});
