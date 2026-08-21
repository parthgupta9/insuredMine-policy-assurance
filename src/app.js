const express = require("express");
const uploadRoutes = require("./routes/uploadRoute");

const app = express();

app.use(express.json());
app.use("/api/upload", uploadRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

module.exports = app;