const path = require("node:path");
const dotenv = require("dotenv");
const { parseDedicatedTestUri } = require("./testDbSafety");

dotenv.config({ path: path.resolve(__dirname, "../.env.test"), quiet: true });

const failClosed = (reason) => {
  console.error(`Mongo integration tests refused to start: ${reason}`);
  process.exit(1);
};

if (process.env.RUN_MONGO_INTEGRATION !== "true") {
  failClosed("set RUN_MONGO_INTEGRATION=true in backend/.env.test to opt in.");
}

if (process.env.ALLOW_TEST_DB_RESET !== "true") {
  failClosed("set ALLOW_TEST_DB_RESET=true after reviewing the dedicated test database configuration.");
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  failClosed("a test-only JWT_SECRET of at least 32 characters is required.");
}

if (process.env.MONGO_URI) {
  failClosed("MONGO_URI is set in this process; integration tests accept only MONGO_TEST_URI.");
}

if (!process.env.MONGO_TEST_URI) {
  failClosed("MONGO_TEST_URI is required.");
}

try {
  parseDedicatedTestUri(process.env.MONGO_TEST_URI);
} catch (error) {
  failClosed(error.message);
}
