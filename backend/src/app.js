const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Pathology Laboratory Management System API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

module.exports = app;