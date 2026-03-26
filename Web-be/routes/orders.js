const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 ตั้งค่าการเก็บไฟล์สลิป
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/slips/"; 
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "slip-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ข้อมูลจำลอง (แนะนำให้เปลี่ยนไปใช้ MongoDB ในอนาคตเพื่อให้ข้อมูลไม่หาย)
let orders = [
  { id: 1, product: "Cap Head", status: "pending", userId: "mark_id" },
];

// ✅ 1. ดูออเดอร์ทั้งหมด (สำหรับ Owner)
router.get("/", authMiddleware("owner"), (req, res) => {
  res.json(orders);
});

// ✅ 2. สร้างออเดอร์ใหม่
router.post("/", authMiddleware(), upload.single("slip"), (req, res) => {
  try {
    const order = { 
      id: Date.now(),
      ...req.body, 
      userId: req.user.id,
      // ✨ แก้ไขจุดนี้: เก็บแค่ path ย่อย "slips/..." 
      // เพื่อไม่ให้เกิดปัญหา /uploads//uploads/ ที่ Frontend
      slip: req.file ? `slips/${req.file.filename}` : null,
      status: "pending" 
    };

    orders.push(order);
    res.json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 3. ยืนยันออเดอร์ (Confirm Order)
router.patch("/confirm/:id", authMiddleware("owner"), (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find((o) => o.id == id);

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    order.status = "completed";
    res.json({ 
      success: true, 
      message: "ยืนยันออเดอร์เรียบร้อยแล้ว", 
      order 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;