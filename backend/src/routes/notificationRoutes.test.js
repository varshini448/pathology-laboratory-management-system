const assert = require("node:assert/strict");
const { test } = require("node:test");
const router = require("./notificationRoutes");

const makeResponse = () => ({
  statusCode: null,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test("notification creation remains restricted to administrator and quality manager roles", () => {
  const route = router.stack.find((layer) => layer.route?.path === "/" && layer.route.methods.post)?.route;
  assert.ok(route);
  const authorize = route.stack[1].handle;
  for (const role of ["TECHNICIAN", "PATHOLOGIST", "DOCTOR", "PATIENT"]) {
    const res = makeResponse();
    let continued = false;
    authorize({ user: { role } }, res, () => { continued = true; });
    assert.equal(res.statusCode, 403);
    assert.equal(continued, false);
  }
  for (const role of ["ADMIN", "QUALITY_MANAGER"]) {
    const res = makeResponse();
    let continued = false;
    authorize({ user: { role } }, res, () => { continued = true; });
    assert.equal(continued, true);
  }
});
