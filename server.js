require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARES
app.use(cors({
  origin: "*", // production me specific domain use karna
}));
app.use(express.json());

// ✅ ROUTES
const authRoutes = require("./routes/auth");
const stakeRoutes = require("./routes/stake");
const walletRoutes = require("./routes/wallet");

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 PovaNFT Backend Running...");
});

// ✅ API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/stake", stakeRoutes);
app.use("/api/wallet", walletRoutes);

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});

// 🔥 DATABASE CONNECT
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected");

  // ✅ SAFE WORKER START (IMPORTANT FIX)
  try {
    require("./workers/stakeWorker");
    require("./workers/depositWorker");
    require("./workers/withdrawWorker");
    console.log("⚙️ Workers started");
  } catch (err) {
    console.log("⚠️ Worker error:", err.message);
  }

  // 🚀 SERVER START
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
  });

})
.catch(err => {
  console.log("❌ DB Error:", err.message);
});