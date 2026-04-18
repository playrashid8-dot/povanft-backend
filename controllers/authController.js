const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateWallet = require("../utils/wallet");
const crypto = require("crypto");

/* ========================
   🔐 SIMPLE ENCRYPTION
======================== */
const ENC_KEY = process.env.ENC_KEY || "12345678901234567890123456789012"; // 32 chars
const IV = process.env.ENC_IV || "1234567890123456"; // 16 chars

function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/* ========================
   🔐 REGISTER
======================== */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 generate wallet index
    const currentIndex = await User.countDocuments();

    // 🔥 generate HD wallet
    const wallet = generateWallet(currentIndex);

    // 🔐 encrypt private key
    const encryptedKey = encrypt(wallet.privateKey);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      walletAddress: wallet.address,
      privateKey: encryptedKey,
      walletIndex: currentIndex,
      balance: 0,
      totalEarnings: 0
    });

    res.json({
      message: "User registered successfully",
      walletAddress: user.walletAddress
    });

  } catch (err) {
    res.status(500).json({
      message: "Register error",
      error: err.message
    });
  }
};


/* ========================
   🔐 LOGIN
======================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    // send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        balance: user.balance,
        totalEarnings: user.totalEarnings
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Login error",
      error: err.message
    });
  }
};