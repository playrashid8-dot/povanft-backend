const mongoose = require("mongoose");

const txSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  txHash: String,
  amount: Number,
  from: String,
  to: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("Transaction", txSchema);