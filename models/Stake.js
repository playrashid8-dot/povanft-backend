const mongoose = require("mongoose");

const stakeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  plan: Number,
  returnPercent: Number,
  profit: Number,
  totalReturn: Number,
  startTime: Date,
  endTime: Date,
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Stake", stakeSchema);