const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

// DEPOSIT
router.post("/deposit", async (req, res) => {
  try {
    const { amount } = req.body;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tx = await Transaction.create({
      userId: decoded.id,
      type: "deposit",
      amount
    });

    res.json({
      message: "Deposit request added",
      tx
    });

  } catch (err) {
    res.status(500).json({ error: "Deposit failed" });
  }
});

// WITHDRAW
router.post("/withdraw", async (req, res) => {
  try {
    const { amount } = req.body;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tx = await Transaction.create({
      userId: decoded.id,
      type: "withdraw",
      amount
    });

    res.json({
      message: "Withdraw request added",
      tx
    });

  } catch (err) {
    res.status(500).json({ error: "Withdraw failed" });
  }
});

module.exports = router;