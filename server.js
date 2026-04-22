require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const userRoutes = require("./routes/user");
const historyRoutes = require("./routes/history");
const stakeRoutes = require("./routes/stake");

const cron = require("node-cron");
const { runDepositWorker } = require("./workers/depositWorker");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/stake", stakeRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend Running...");
});

/* 🔄 CRON JOB (every 30 sec) */
cron.schedule("*/30 * * * * *", async () => {
  await runDepositWorker();
});

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on ${PORT}`);
});