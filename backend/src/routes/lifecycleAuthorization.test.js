const assert = require("node:assert/strict");
const { test } = require("node:test");
const caseRoutes = require("./caseRoutes");
const qcRoutes = require("./qcRoutes");
const reportRoutes = require("./reportRoutes");
const doctorVerificationRoutes = require("./doctorVerificationRoutes");
const userRoutes = require("./userRoutes");

const getAuthorize = (router, path, method) => {
  const route = router.stack.find((layer) => layer.route?.path === path && layer.route.methods[method])?.route;
  assert.ok(route, `missing ${method.toUpperCase()} ${path} route`);
  return route.stack[1].handle;
};

const check = (authorize, allowed, denied) => {
  for (const role of allowed) {
    let continued = false;
    authorize({ user: { role } }, { status() { return this; }, json() {} }, () => { continued = true; });
    assert.equal(continued, true, `${role} should be authorized`);
  }
  for (const role of denied) {
    let continued = false;
    let status;
    authorize({ user: { role } }, { status(code) { status = code; return this; }, json() {} }, () => { continued = true; });
    assert.equal(status, 403);
    assert.equal(continued, false, `${role} should be denied`);
  }
};

test("case creation and QC decision routes reject external or unrelated roles", () => {
  check(getAuthorize(caseRoutes, "/", "post"), ["ADMIN", "TECHNICIAN"], ["DOCTOR", "PATIENT", "QUALITY_MANAGER"]);
  check(getAuthorize(qcRoutes, "/", "post"), ["ADMIN", "QUALITY_MANAGER", "PATHOLOGIST"], ["TECHNICIAN", "DOCTOR", "PATIENT"]);
});

test("report sign-out and approval routes remain administrator/pathologist restricted", () => {
  check(getAuthorize(reportRoutes, "/:id/sign-out", "post"), ["ADMIN", "PATHOLOGIST"], ["TECHNICIAN", "QUALITY_MANAGER", "DOCTOR", "PATIENT"]);
  check(getAuthorize(doctorVerificationRoutes, "/:doctorId/approve", "put"), ["ADMIN"], ["TECHNICIAN", "PATHOLOGIST", "DOCTOR", "PATIENT"]);
  check(getAuthorize(userRoutes, "/admin/users/:userId/approve", "put"), ["ADMIN"], ["TECHNICIAN", "PATHOLOGIST", "DOCTOR", "PATIENT"]);
});
