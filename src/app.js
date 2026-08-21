const express = require("express");
const uploadRoutes = require("./routes/uploadRoute");
const policyRoutes = require("./routes/policyRoute");

const app = express();

app.use(express.json());
app.use("/api/upload", uploadRoutes);

app.use(
  "/api/policies",
  policyRoutes
);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

module.exports = app;