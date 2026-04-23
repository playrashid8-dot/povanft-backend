import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();


// 🔥 CORS (IMPORTANT FIX for frontend)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// 🔧 MIDDLEWARE
app.use(express.json());


// 🧠 CONNECT DATABASE
connectDB();


// 🔗 ROUTES
app.use("/api/auth", authRoutes);


// 🧪 TEST ROUTE (optional but useful)
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});


// 🚀 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});