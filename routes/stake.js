const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// STAKE
router.post("/", async (req, res) => {
  try {
    const { amount } = req.body;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (user.balance < amount) {
      return res.json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    user.totalEarnings += amount * 0.1; // simple profit demo

    await user.save();

    res.json({ message: "Staking started 🚀" });

  } catch {
    res.status(401).json({ message: "Error staking" });
  }
});

module.exports = router;