require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

// ROUTES
const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const userRoutes = require("./routes/user");
const historyRoutes = require("./routes/history");
const stakeRoutes = require("./routes/stake");

// WORKERS
const { runDepositWorker } = require("./workers/depositWorker");
// (future)
// const { runGasWorker } = require("./workers/gasWorker");
// const { runSweepWorker } = require("./workers/sweepWorker");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("🚀 PovaNFT Backend Running...");
});

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/stake", stakeRoutes);

/* ======================
   DATABASE CONNECT
====================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ DB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

    /* ======================
       CRON JOBS (WORKERS)
    ====================== */

    // 🔄 Deposit checker (every 30 sec)
    cron.schedule("*/30 * * * * *", async () => {
      await runDepositWorker();
    });

    console.log("⚙️ Workers started...");
  })
  .catch(err => {
    console.log("❌ DB Error:", err.message);
  });

/* ======================
   GLOBAL ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});