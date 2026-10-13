const assert = require("node:assert/strict");
const { test } = require("node:test");

const routes = require("./workflowRoutes");
const workflowBottleneckService = require("../services/workflowBottleneckService");

const bottleneckRoute = routes.stack
  .map((layer) => layer.route)
  .find((route) => route?.path === "/bottlenecks" && route.methods.get);

const invoke = (middleware, req) => {
  const res = {
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
  };
  let continued = false;
  middleware(req, res, () => { continued = true; });
  return { res, continued };
};

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

test("workflow bottleneck route requires authentication and internal laboratory roles", () => {
  assert.ok(bottleneckRoute, "GET /bottlenecks route is registered");
  const [protect, authorize, controller] = bottleneckRoute.stack.map((layer) => layer.handle);
  assert.equal(protect.name, "protect");
  assert.equal(typeof controller, "function");

  const unauthenticated = invoke(protect, { headers: {} });
  assert.equal(unauthenticated.res.statusCode, 401);
  assert.equal(unauthenticated.continued, false);

  for (const role of ["ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"]) {
    const allowed = invoke(authorize, { user: { role } });
    assert.equal(allowed.continued, true, `${role} should be allowed`);
  }

  const externalRole = invoke(authorize, { user: { role: "DOCTOR" } });
  assert.equal(externalRole.res.statusCode, 403);
  assert.equal(externalRole.continued, false);
});

test("controller returns the rules result and masks service failures", async () => {
  const originalGet = workflowBottleneckService.getWorkflowBottlenecks;
  const controller = bottleneckRoute.stack.at(-1).handle;

  try {
    workflowBottleneckService.getWorkflowBottlenecks = async () => ({
      delayedCaseCount: 0,
      stages: [],
    });
    const success = makeResponse();
    await controller({}, success);
    assert.equal(success.statusCode, 200);
    assert.equal(success.body.data.delayedCaseCount, 0);

    workflowBottleneckService.getWorkflowBottlenecks = async () => {
      throw new Error("internal database detail");
    };
    const failure = makeResponse();
    await controller({}, failure);
    assert.equal(failure.statusCode, 500);
    assert.equal(failure.body.message, "Unable to evaluate workflow bottlenecks right now.");
    assert.equal(JSON.stringify(failure.body).includes("internal database detail"), false);
  } finally {
    workflowBottleneckService.getWorkflowBottlenecks = originalGet;
  }
});
