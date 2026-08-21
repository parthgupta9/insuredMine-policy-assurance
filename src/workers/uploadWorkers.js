const { Worker } = require("worker_threads");
const { workerData, parentPort } =
  require("worker_threads");

console.log(workerData);
parentPort.postMessage({
  success: true,
  message: "Worker thread executed successfully",
});