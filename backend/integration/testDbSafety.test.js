const assert = require("node:assert/strict");
const { test } = require("node:test");
const { parseDedicatedTestUri } = require("./testDbSafety");

test("test Mongo URI accepts the dedicated database only", () => {
  const uri = parseDedicatedTestUri("mongodb://127.0.0.1:27017/pathology_laboratory_test");
  assert.equal(uri.pathname, "/pathology_laboratory_test");
});

test("test Mongo URI refuses the original database and dbName overrides", () => {
  assert.throws(
    () => parseDedicatedTestUri("mongodb://127.0.0.1:27017/pathology_laboratory"),
    /exactly pathology_laboratory_test/
  );
  assert.throws(
    () => parseDedicatedTestUri("mongodb://127.0.0.1:27017/pathology_laboratory_test?dbName=pathology_laboratory"),
    /may not override/
  );
});

test("test Mongo URI rejects non-Mongo protocols", () => {
  assert.throws(() => parseDedicatedTestUri("https://example.test/pathology_laboratory_test"), /mongodb/);
});
