require("dotenv").config();
const mongoose = require("mongoose");
const Agent = require("../models/Agent");
const { workerData, parentPort } =
  require("worker_threads");
const fs = require("fs");
const csv = require("csv-parser");

const rows = [];

function buildMaps(rows) {
  const agentMap = new Map();
  const carrierMap = new Map();
  const lobMap = new Map();
  const accountMap = new Map();
  const userMap = new Map();

  rows.forEach((row) => {
    if (row.agent) {
      agentMap.set(row.agent.trim(), null);
    }

    if (row.company_name) {
      carrierMap.set(
        row.company_name.trim(),
        null
      );
    }

    if (row.category_name) {
      lobMap.set(
        row.category_name.trim(),
        null
      );
    }

    if (row.account_name) {
      accountMap.set(
        row.account_name.trim(),
        null
      );
    }

    const userKey =
      `${row.email?.trim()}_${row.phone?.trim()}`;

    userMap.set(userKey, null);
  });

  return {
    agentMap,
    carrierMap,
    lobMap,
    accountMap,
    userMap,
  };
}

async function processAgents(agentMap) {
  await mongoose.connect(process.env.MONGO_URI);

  const agents = [...agentMap.keys()].map(
    (agentName) => ({
      agentName,
    })
  );

  const insertedAgents =
    await Agent.insertMany(agents, {
      ordered: false,
    });

  return insertedAgents.length;
}


fs.createReadStream(workerData.filePath)
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
 .on("end", async() => {

const {
  agentMap,
  carrierMap,
  lobMap,
  accountMap,
  userMap,
} = buildMaps(rows);

try {
  const insertedAgents =
    await processAgents(agentMap);

  parentPort.postMessage({
    success: true,
    totalRows: rows.length,
    insertedAgents,
    uniqueAgents: agentMap.size,
  });
} catch (error) {
  parentPort.postMessage({
    success: false,
    message: error.message,
  });
}
})
  .on("error", (error) => {
    parentPort.postMessage({
      success: false,
      message: error.message,
    });
  });
