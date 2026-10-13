const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const PasswordResetToken = require("../models/PasswordResetToken");
const {
  requestPasswordReset,
  resetPassword,
} = require("./passwordResetController");

const modelMethods = [
  [User, ["find", "findById"]],
  [Patient, ["findOne", "findById"]],
  [Doctor, ["findOne", "findById"]],
  [PasswordResetToken, ["create", "deleteMany", "findOne", "findOneAndUpdate"]],
];
const originals = modelMethods.map(([model, methods]) =>
  methods.map((method) => [model, method, model[method]])
).flat();
const validToken = "a".repeat(64);

const makeResponse = () => ({
  statusCode: 200,
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

test.afterEach(() => {
  for (const [model, method, original] of originals) {
    model[method] = original;
  }
});

test("reset request rejects missing and malformed fields before database access", async () => {
  let queried = false;
  User.find = Patient.findOne = Doctor.findOne = () => {
    queried = true;
    throw new Error("database should not be queried");
  };

  for (const body of [undefined, {}, { accountType: "external" }, {
    accountType: "external",
    identifier: "   ",
  }]) {
    const res = makeResponse();
    await requestPasswordReset({ body }, res);
    assert.equal(res.statusCode, 400);
  }
  assert.equal(queried, false);
});

test("reset request rejects an unsupported account type", async () => {
  const res = makeResponse();
  await requestPasswordReset({
    body: { accountType: "patient", identifier: "person@example.test" },
  }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Invalid account type.");
});

test("valid reset requests return generic 503 without account lookup or token creation", async () => {
  let databaseCalls = 0;
  User.find = Patient.findOne = Doctor.findOne = () => { databaseCalls += 1; };
  PasswordResetToken.create = PasswordResetToken.deleteMany = () => { databaseCalls += 1; };

  const responses = [];
  for (const identifier of ["known@example.test", "unknown@example.test"]) {
    const res = makeResponse();
    await requestPasswordReset({
      body: { accountType: "external", identifier },
    }, res);
    responses.push(res);
  }

  assert.equal(databaseCalls, 0);
  assert.equal(responses[0].statusCode, 503);
  assert.deepEqual(responses[0].body, responses[1].body);
  assert.match(responses[0].body.message, /delivery is not configured/i);
  assert.equal("resetToken" in responses[0].body, false);
});

test("reset rejects malformed tokens and passwords shorter than policy", async () => {
  let queried = false;
  PasswordResetToken.findOneAndUpdate = () => { queried = true; };

  for (const body of [
    { token: "not-a-token", password: "new-secure-password" },
    { token: validToken, password: "short" },
  ]) {
    const res = makeResponse();
    await resetPassword({ body }, res);
    assert.equal(res.statusCode, 400);
  }
  assert.equal(queried, false);
});

test("invalid, expired, and previously-used token claims are rejected", async () => {
  let query;
  PasswordResetToken.findOneAndUpdate = async (filter) => {
    query = filter;
    return null;
  };
  User.findById = () => { throw new Error("account must not be loaded"); };
  const res = makeResponse();

  await resetPassword({
    body: { token: validToken, password: "new-secure-password" },
  }, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /invalid or expired/i);
  assert.equal(query.tokenHash, crypto.createHash("sha256").update(validToken).digest("hex"));
  assert.equal(query.usedAt, null);
  assert.ok(query.expiresAt.$gt instanceof Date);
});

test("valid reset hashes the password and atomically consumes the token once", async () => {
  const tokenRecord = { userId: "doctor-id", userType: "DOCTOR" };
  const account = {
    password: "old-hash",
    save: async () => {},
  };
  let savedPassword;
  account.save = async () => { savedPassword = account.password; };
  let claimArguments;

  PasswordResetToken.findOneAndUpdate = async (...args) => {
    claimArguments = args;
    tokenRecord.usedAt = args[1].$set.usedAt;
    return tokenRecord;
  };
  Doctor.findById = async (id) => {
    assert.equal(id, "doctor-id");
    return account;
  };

  const res = makeResponse();
  await resetPassword({
    body: { token: validToken, password: "new-secure-password" },
  }, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body.message, /reset successfully/i);
  assert.equal(claimArguments[0].usedAt, null);
  assert.ok(claimArguments[0].expiresAt.$gt instanceof Date);
  assert.deepEqual(claimArguments[1], { $set: { usedAt: tokenRecord.usedAt } });
  assert.deepEqual(claimArguments[2], { new: true });
  assert.notEqual(savedPassword, "new-secure-password");
  assert.equal(await bcrypt.compare("new-secure-password", savedPassword), true);
});

test("only one concurrent attempt can claim and use a reset token", async () => {
  let claimed = false;
  let accountSaveCount = 0;
  PasswordResetToken.findOneAndUpdate = async () => {
    if (claimed) return null;
    claimed = true;
    return { userId: "doctor-id", userType: "DOCTOR" };
  };
  Doctor.findById = async () => ({
    save: async () => { accountSaveCount += 1; },
  });

  const responses = [makeResponse(), makeResponse()];
  await Promise.all(responses.map((res) => resetPassword({
    body: { token: validToken, password: "new-secure-password" },
  }, res)));

  assert.deepEqual(responses.map((res) => res.statusCode).sort(), [200, 400]);
  assert.equal(accountSaveCount, 1);
});

test("reset failures return a generic message without reflecting internal errors", async () => {
  const logged = [];
  const originalError = console.error;
  console.error = (...args) => logged.push(args);
  PasswordResetToken.findOneAndUpdate = async () => {
    throw new Error(`sensitive internal detail ${validToken}`);
  };
  const res = makeResponse();

  try {
    await resetPassword({
      body: { token: validToken, password: "new-secure-password" },
    }, res);
  } finally {
    console.error = originalError;
  }

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, "Unable to reset password.");
  assert.equal(JSON.stringify(res.body).includes(validToken), false);
  assert.equal(JSON.stringify(logged).includes(validToken), false);
});
