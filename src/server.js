require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const {
  startCpuMonitor,
} = require(
  "./services/cpuMonitor"
);
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  startCpuMonitor();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
};

startServer();