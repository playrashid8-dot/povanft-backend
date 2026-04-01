const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Withdraw API
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.json({ error: "User not found" });

    if (user.balance < amount) {
      return res.json({ error: "Insufficient balance" });
    }

    // 5% fee
    const finalAmount = amount * 0.95;

    user.balance -= amount;
    await user.save();

    await Transaction.create({
      userId,
      type: "withdraw",
      amount: finalAmount
    });

    res.json({
      message: "Withdraw request placed",
      amount: finalAmount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;