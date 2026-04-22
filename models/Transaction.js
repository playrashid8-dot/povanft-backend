const mongoose = require("mongoose");

const txSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  txHash: String,
  amount: Number,
  type: String, // deposit / withdraw

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", txSchema);