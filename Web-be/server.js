require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

// 🚏 IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/products");
const ordersRoute = require("./routes/orders");
const couponRoutes = require("./routes/coupons");

const app = express();

// ====================
// 🔗 CONNECT MONGODB
// ====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ====================
// 🔧 MIDDLEWARE
// ====================
app.use(helmet({
  crossOriginResourcePolicy: false, // อนุญาตให้ดึงรูปจาก Server ไปแสดงที่หน้าเว็บได้
}));

// แก้ไขจุดนี้: รองรับทั้ง Local และ Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://mini-projet-henna.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // อนุญาตถ้าไม่มี origin (เช่น การเรียกจาก Postman) หรือ origin อยู่ในรายการที่กำหนด
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====================
// 📂 STATIC FILES
// ====================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================
// 🚏 ROUTES
// ====================
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", ordersRoute);
app.use("/coupons", couponRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API RUNNING OK - Ready for Vercel & Local");
});

// ====================
// ❗ ERROR HANDLER
// ====================
app.use((err, req, res, next) => {
  console.error("🔥 REAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message,
    // ป้องกันการรั่วไหลของข้อมูล (OWASP) จะโชว์ stack เฉพาะตอน development เท่านั้น
    stack: process.env.NODE_ENV === "development" ? err.stack : {}
  });
});

// ====================
// 🚀 START
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});