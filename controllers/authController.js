const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/encryption");
const jwt = require("jsonwebtoken");
const { Wallet } = require("ethers");

exports.register = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;

    const hashed = await hashPassword(password);

    const wallet = Wallet.createRandom();

    const user = await User.create({
      username,
      email,
      password: hashed,
      referralCode: Math.random().toString(36).substring(7),
      referredBy: referralCode || null,
      walletAddress: wallet.address,
      privateKey: wallet.privateKey
    });

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await comparePassword(password, user.password);

  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
};