require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path"); 

// 🚏 IMPORT ROUTES (เหลือแค่ของเดิมที่ใช้งานได้)
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
// ใส่ Helmet แบบนี้ไว้ครับ เพื่อไม่ให้มันบล็อกรูปสินค้า
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====================
// 📂 STATIC FILES
// ====================
// บรรทัดนี้สำคัญมาก เพื่อให้รูปสินค้าในโฟลเดอร์ uploads โชว์ได้
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================
// 🚏 ROUTES (ลบ /users ออกแล้ว)
// ====================
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", ordersRoute);
app.use("/coupons", couponRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API RUNNING OK");
});

// ====================
// ❗ ERROR HANDLER
// ====================
app.use((err, req, res, next) => {
  console.error("🔥 REAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message,
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