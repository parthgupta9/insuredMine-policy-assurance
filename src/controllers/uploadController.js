const path = require("path");
const { Worker } = require("worker_threads");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const worker = new Worker(
      path.join(__dirname, "../workers/uploadWorkers.js"),
      {
        workerData: {
          filePath: req.file.path,
          fileName: req.file.filename,
        },
      },
    );
    worker.on("message", (message) => {
      console.log("Worker message:", message);
      res.status(200).json(message);
    });
    worker.on("error", (error) => {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
