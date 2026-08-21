const express = require("express");
const router = express.Router();

const {
  searchPolicyByUser,
} = require("../controllers/policyController");
const {
  aggregatePolicies,
} = require("../controllers/policyController");

router.get(
  "/search",
  searchPolicyByUser
);

router.get(
  "/aggregate",
  aggregatePolicies
);

module.exports = router;