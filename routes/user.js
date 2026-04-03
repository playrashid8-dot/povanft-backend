const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.json({
      balance: user.balance,
      totalEarnings: user.totalEarnings
    });

  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;