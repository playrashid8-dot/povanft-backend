const express = require("express");
const Stake = require("../models/Stake");
const User = require("../models/User");

const router = express.Router();

const plans = {
  1: { days: 4, percent: 5 },
  2: { days: 7, percent: 10 },
  3: { days: 15, percent: 20 },
  4: { days: 30, percent: 45 }
};

router.post("/create", async (req, res) => {
  try {
    const { userId, amount, planId } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.json({ error: "User not found" });
    if (user.balance < amount)
      return res.json({ error: "Insufficient balance" });

    const plan = plans[planId];
    if (!plan) return res.json({ error: "Invalid plan" });

    const profit = (amount * plan.percent) / 100;
    const totalReturn = amount + profit;

    const stake = new Stake({
      userId,
      amount,
      plan: planId,
      returnPercent: plan.percent,
      profit,
      totalReturn,
      startTime: new Date(),
      endTime: new Date(Date.now() + plan.days * 86400000)
    });

    user.balance -= amount;
    user.activeStake += amount;

    await user.save();
    await stake.save();

    res.json({ message: "✅ Stake created" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;