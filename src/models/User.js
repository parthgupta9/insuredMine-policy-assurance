const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    dob: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    zipCode: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    gender: {
      type: String,
      trim: true,
    },

    userType: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  {
    email: 1,
    phoneNumber: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("User", userSchema);