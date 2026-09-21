const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const caseRoutes = require("./routes/caseRoutes");
const specimenRoutes = require("./routes/specimenRoutes");
const blockRoutes = require("./routes/blockRoutes");
const app = express();
const slideRoutes = require("./routes/slideRoutes");
const workflowRoutes = require("./routes/workflowRoutes");
const qcRoutes = require("./routes/qcRoutes");
const reportRoutes = require("./routes/reportRoutes");
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Pathology Laboratory Management System API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/cases", caseRoutes);
app.use("/specimens", specimenRoutes);
app.use("/blocks", blockRoutes);
app.use("/slides", slideRoutes);
app.use("/workflow", workflowRoutes);
app.use("/qc", qcRoutes);
app.use("/reports", reportRoutes);
module.exports = app;