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

  activeStake: { type: Number, default: 0 },

  directCount: { type: Number, default: 0 },
  teamCount: { type: Number, default: 0 },
  teamVolume: { type: Number, default: 0 },

  salaryStageClaimed: { type: Number, default: 0 },

  snapshot: {
    directs: { type: Number, default: 0 },
    team: { type: Number, default: 0 },
    volume: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("User", userSchema);