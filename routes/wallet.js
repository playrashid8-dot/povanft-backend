const express = require("express");
const router = express.Router();
const User = require("../models/User");

// DEPOSIT
router.post("/deposit", async (req, res) => {
  const { amount } = req.body;

  res.json({ message: "Deposit request sent" });
});

// WITHDRAW
router.post("/withdraw", async (req, res) => {
  const { amount } = req.body;

  res.json({ message: "Withdraw request sent" });
});

module.exports = router;