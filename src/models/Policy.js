const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    policyStartDate: {
      type: Date,
    },

    policyEndDate: {
      type: Date,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },

    lobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LOB",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

policySchema.index({
  userId: 1,
});

module.exports = mongoose.model("Policy", policySchema);