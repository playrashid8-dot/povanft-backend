const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);