const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyNumber: String,

    policyStartDate: Date,

    policyEndDate: Date,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },

    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
    },

    lobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LOB",
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Policy",
  policySchema
);