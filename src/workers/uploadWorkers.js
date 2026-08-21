require("dotenv").config();
const mongoose = require("mongoose");
const Agent = require("../models/Agent");
const { workerData, parentPort } = require("worker_threads");
const fs = require("fs");
const csv = require("csv-parser");
const dns = require("dns");
const Carrier =
  require("../models/Carrier");

const LOB =
  require("../models/Lob");

const Account =
  require("../models/Account");

const User =
  require("../models/User");

const Policy =
  require("../models/Policy");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
      carrierMap.set(row.company_name.trim(), null);
    }

    if (row.category_name) {
      lobMap.set(row.category_name.trim(), null);
    }

    if (row.account_name) {
      accountMap.set(row.account_name.trim(), null);
    }

    const userKey = `${row.email?.trim()}_${row.phone?.trim()}`;

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

async function bulkUpsert(
  Model,
  values,
  fieldName
) {
  const operations = values.map(
    (value) => ({
      updateOne: {
        filter: {
          [fieldName]: value,
        },
        update: {
          $setOnInsert: {
            [fieldName]: value,
          },
        },
        upsert: true,
      },
    })
  );

  await Model.bulkWrite(
    operations
  );

  const documents =
    await Model.find();

  const map = new Map();

  documents.forEach((doc) => {
    map.set(
      doc[fieldName],
      doc._id
    );
  });

  return map;
}

async function insertUsers(rows) {

  const seen = new Set();

  const users = [];

  rows.forEach((row) => {

    const key =
      `${row.email?.trim()}_${row.phone?.trim()}`;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);

    users.push({
      firstName:
        row.firstname,

      dob: row.dob,

      address:
        row.address,

      phoneNumber:
        row.phone,

      state:
        row.state,

      zipCode:
        row.zip,

      email:
        row.email,

      gender:
        row.gender,

      userType:
        row.userType,
    });
  });

  await User.insertMany(
    users,
    {
      ordered: false,
    }
  );

  const allUsers =
    await User.find();

  const userLookup =
    new Map();

  allUsers.forEach((user) => {

    const key =
      `${user.email}_${user.phoneNumber}`;

    userLookup.set(
      key,
      user._id
    );
  });

  return userLookup;
}
async function insertPolicies(
  rows,
  agentLookup,
  carrierLookup,
  lobLookup,
  accountLookup,
  userLookup
) {
  const policies = [];

  rows.forEach((row) => {

    const userKey =
      `${row.email?.trim()}_${row.phone?.trim()}`;

    policies.push({
      policyNumber:
        row.policy_number,

      policyStartDate:
        row.policy_start_date,

      policyEndDate:
        row.policy_end_date,

      userId:
        userLookup.get(userKey),

      agentId:
        agentLookup.get(
          row.agent?.trim()
        ),

      carrierId:
        carrierLookup.get(
          row.company_name?.trim()
        ),

      lobId:
        lobLookup.get(
          row.category_name?.trim()
        ),

      accountId:
        accountLookup.get(
          row.account_name?.trim()
        ),
    });
  });

  await Policy.insertMany(
    policies,
    {
      ordered: false,
    }
  );

  return policies.length;
}

fs.createReadStream(workerData.filePath)
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
 .on("end", async () => {
  try {

    const {
      agentMap,
      carrierMap,
      lobMap,
      accountMap,
      userMap,
    } = buildMaps(rows);

    await mongoose.connect(
      process.env.MONGO_URI
    );

    const agentLookup =
      await bulkUpsert(
        Agent,
        [...agentMap.keys()],
        "agentName"
      );

    const carrierLookup =
      await bulkUpsert(
        Carrier,
        [...carrierMap.keys()],
        "companyName"
      );

    const lobLookup =
      await bulkUpsert(
        LOB,
        [...lobMap.keys()],
        "categoryName"
      );

    const accountLookup =
      await bulkUpsert(
        Account,
        [...accountMap.keys()],
        "accountName"
      );

    const userLookup =
      await insertUsers(rows);

      const totalPolicies =
  await insertPolicies(
    rows,
    agentLookup,
    carrierLookup,
    lobLookup,
    accountLookup,
    userLookup
  );

   parentPort.postMessage({
  success: true,

  totalRows: rows.length,

  agents: agentLookup.size,

  carriers: carrierLookup.size,

  lobs: lobLookup.size,

  accounts: accountLookup.size,

  users: userLookup.size,

  policies: totalPolicies,
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
