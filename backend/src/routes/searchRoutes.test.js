const assert = require("node:assert/strict");
const { test } = require("node:test");
const router = require("./searchRoutes");

const roleGate = router.stack.find((layer) => layer.route?.path === "/").route.stack[1].handle;
const runGate = (role) => {
  let nextCalled = false;
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
  roleGate({ user: { role } }, res, () => { nextCalled = true; });
  return { nextCalled, res };
};

test("case search permits only internal laboratory roles", () => {
  for (const role of ["ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"]) {
    assert.equal(runGate(role).nextCalled, true, `${role} should search authorized cases`);
  }
  for (const role of ["DOCTOR", "PATIENT", "UNKNOWN"]) {
    const result = runGate(role);
    assert.equal(result.nextCalled, false, `${role} should not search the internal case directory`);
    assert.equal(result.res.statusCode, 403);
  }
});
