const mongoose = require("mongoose");

const scheduledMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "SENT"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

scheduledMessageSchema.index({
  status: 1,
  scheduledDate: 1,
});

module.exports = mongoose.model(
  "ScheduledMessage",
  scheduledMessageSchema
);