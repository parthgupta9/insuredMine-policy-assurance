const { Worker } = require("worker_threads");
const { workerData, parentPort } =
  require("worker_threads");
const fs = require("fs");
const csv = require("csv-parser");

const rows = [];

fs.createReadStream(workerData.filePath)
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
  .on("end", () => {
    console.log(`CSV file ${workerData.fileName} processed successfully`);
    parentPort.postMessage({
      success: true,
      totalRows: rows.length,
      sampleRow: rows[0],
    });
  })
  .on("error", (error) => {
    parentPort.postMessage({
      success: false,
      message: error.message,
    });
  });