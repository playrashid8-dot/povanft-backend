require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const stakeRoutes = require("./routes/stake");
const walletRoutes = require("./routes/wallet");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 PovaNFT Backend Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stake", stakeRoutes);
app.use("/api/wallet", walletRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// 🔥 DB CONNECT + WORKERS START (IMPORTANT)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // ✅ Workers yahan start honge (DB ready ke baad)
    require("./workers/stakeWorker");
    require("./workers/depositWorker");
    require("./workers/withdrawWorker");

    // 🚀 Server start
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("❌ DB Error:", err);
  });