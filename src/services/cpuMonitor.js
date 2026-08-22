const pidusage = require("pidusage");

function startCpuMonitor() {
  setInterval(async () => {
    try {
      const stats =
        await pidusage(process.pid);

      console.log(
        `CPU Usage: ${stats.cpu.toFixed(2)}%`
      );

      if (stats.cpu > 0) {
        console.log(
          "CPU exceeded 70%. Restarting..."
        );

        process.exit(1);
      }
    } catch (error) {
      console.error(
        "CPU Monitor Error:",
        error.message
      );
    }
  }, 5000);
}

module.exports = {
  startCpuMonitor,
};