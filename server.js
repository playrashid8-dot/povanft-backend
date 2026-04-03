require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 PovaNFT Backend Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch(err => console.log(err));