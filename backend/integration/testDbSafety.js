const TEST_DATABASE_NAME = "pathology_laboratory_test";

const parseDedicatedTestUri = (value) => {
  let uri;
  try {
    uri = new URL(value);
  } catch {
    throw new Error("MONGO_TEST_URI is not a valid MongoDB URI.");
  }
  if (!["mongodb:", "mongodb+srv:"].includes(uri.protocol)) {
    throw new Error("MONGO_TEST_URI must use mongodb:// or mongodb+srv://.");
  }
  const databaseName = decodeURIComponent(uri.pathname.replace(/^\//, ""));
  if (databaseName !== TEST_DATABASE_NAME) {
    throw new Error("the URI database path must be exactly pathology_laboratory_test.");
  }
  const explicitDatabaseName = uri.searchParams.get("dbName");
  if (explicitDatabaseName && explicitDatabaseName !== TEST_DATABASE_NAME) {
    throw new Error("a dbName URI option may not override the dedicated test database.");
  }
  return uri;
};

module.exports = { TEST_DATABASE_NAME, parseDedicatedTestUri };
