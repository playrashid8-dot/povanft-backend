require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ROUTES
const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const userRoutes = require("./routes/user");
const historyRoutes = require("./routes/history"); // ✅ yahan add karo

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 PovaNFT Backend Running...");
});

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", historyRoutes); // ✅ yahan hona chahiye

// DB CONNECT + SERVER START
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