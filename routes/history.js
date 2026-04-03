const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

// GET HISTORY
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const history = await Transaction.find({
      userId: decoded.id
    }).sort({ createdAt: -1 });

    res.json(history);

  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;