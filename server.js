require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   ROUTES IMPORT
====================== */
const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const userRoutes = require("./routes/user");
const historyRoutes = require("./routes/history");
const stakeRoutes = require("./routes/stake"); // ✅ yahan shift kiya

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
app.use("/api/stake", stakeRoutes); // ✅ yahan hona chahiye

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
  })
  .catch(err => {
    console.log("❌ DB Error:", err);
  });