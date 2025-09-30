// ******** Import Configs ******** //
const mongoose = require("mongoose");

// ******** Email Validation Functions ******** //
const validateEmail = (email) => {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ******** Create Schema ******** //
const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    phonePrefix: {
      type: String,
      unique: false,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
    },
    emailOtp: {
      type: String,
    },
    emailOtpExpiry: {
      type: Date,
    },
    emailOtp: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    about: {
      type: String,
    },
    lastSeen: {
      type: Date,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    agreed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ******** Create Model ******** //
const User = mongoose.model("User", userSchema);

// ******** Exports ******** //
module.exports = User;
