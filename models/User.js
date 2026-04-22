const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  referralCode: String,
  referredBy: String,

  walletAddress: String,
  privateKey: String,

  balance: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);