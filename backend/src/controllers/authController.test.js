const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { login } = require("./authController");

const originalFindOne = User.findOne;
const originalJwtSecret = process.env.JWT_SECRET;
const originalConsoleInfo = console.info;
const testSecret = "internal-auth-controller-test-secret";
let diagnosticLogs = [];

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
  diagnosticLogs = [];
  console.info = (...args) => diagnosticLogs.push(args);
});

test.afterEach(() => {
  User.findOne = originalFindOne;
  console.info = originalConsoleInfo;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
});

test("active internal login accepts the expected payload and returns its role", async () => {
  const user = {
    _id: "internal-user-test-id",
    email: "staff@example.test",
    name: "Test Staff",
    role: "TECHNICIAN",
    status: "ACTIVE",
    password: await bcrypt.hash("synthetic-test-password", 4),
    save: async () => {},
  };
  User.findOne = async (query) => {
    assert.deepEqual(query.$or, [
      { email: "staff-test" },
      { "profile.employeeId": "STAFF-TEST" },
      { "profile.medicalRegistrationId": "STAFF-TEST" },
    ]);
    return user;
  };

  const res = makeResponse();
  await login({ body: {
    identifier: "STAFF-TEST",
    password: "synthetic-test-password",
    accountType: "internal",
  } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.role, "TECHNICIAN");
  assert.equal("password" in res.body.user, false);
  const claims = jwt.verify(res.body.token, testSecret);
  assert.equal(claims.role, "TECHNICIAN");
  assert.equal(claims.userType, "INTERNAL");
  assert.deepEqual(diagnosticLogs[0], ["[auth.login.diagnostic]", {
    accountMatched: true,
    accountType: "INTERNAL",
    accountRole: "TECHNICIAN",
    accountStatus: "ACTIVE",
    passwordHashExists: true,
    passwordComparisonSucceeded: true,
  }]);
  assert.equal(JSON.stringify(diagnosticLogs).includes("STAFF-TEST"), false);
  assert.equal(JSON.stringify(diagnosticLogs).includes("synthetic-test-password"), false);
});

test("internal invalid credentials return a generic 401", async () => {
  User.findOne = async () => ({
    _id: "internal-user-test-id",
    status: "ACTIVE",
    password: await bcrypt.hash("a-different-test-password", 4),
  });

  const res = makeResponse();
  await login({ body: {
    identifier: "staff@example.test",
    password: "synthetic-test-password",
    accountType: "internal",
  } }, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Invalid identifier or password");
  assert.equal(diagnosticLogs[0][1].passwordComparisonSucceeded, false);
});

test("an internal account without a password hash is rejected safely", async () => {
  User.findOne = async () => ({
    status: "ACTIVE",
    password: undefined,
  });

  const res = makeResponse();
  await login({ body: {
    identifier: "staff@example.test",
    password: "synthetic-test-password",
    accountType: "internal",
  } }, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(diagnosticLogs[0][1], {
    accountMatched: true,
    accountType: "INTERNAL",
    accountRole: null,
    accountStatus: "ACTIVE",
    passwordHashExists: false,
    passwordComparisonSucceeded: null,
  });
});

test("internal accounts awaiting administrator approval return 403", async () => {
  User.findOne = async () => ({ status: "PENDING_APPROVAL" });

  const res = makeResponse();
  await login({ body: {
    identifier: "staff@example.test",
    password: "synthetic-test-password",
    accountType: "internal",
  } }, res);

  assert.equal(res.statusCode, 403);
  assert.match(res.body.message, /pending administrator approval/i);
  assert.equal(diagnosticLogs[0][1].accountStatus, "PENDING_APPROVAL");
  assert.equal(diagnosticLogs[0][1].passwordComparisonSucceeded, null);
});

test("unknown internal identifier logs only a safe no-match diagnostic", async () => {
  User.findOne = async () => null;

  const res = makeResponse();
  await login({ body: {
    identifier: "synthetic-unknown-identifier",
    password: "synthetic-test-password",
    accountType: "internal",
  } }, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(diagnosticLogs[0], ["[auth.login.diagnostic]", {
    accountMatched: false,
    accountType: "INTERNAL",
    accountRole: null,
    accountStatus: null,
    passwordHashExists: false,
    passwordComparisonSucceeded: null,
  }]);
  assert.equal(JSON.stringify(diagnosticLogs).includes("synthetic-unknown-identifier"), false);
  assert.equal(JSON.stringify(diagnosticLogs).includes("synthetic-test-password"), false);
});
