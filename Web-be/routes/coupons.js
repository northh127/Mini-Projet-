const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ จำลองฐานข้อมูลคูปอง (สไตล์เดียวกับ orders ของคุณ)
let coupons = [
  { id: 1, code: "WELCOME10", discount: 10 }, // ลด 10%
  { id: 2, code: "REREM50", discount: 50 },    // ลด 50%
];

// ✅ 1. POST validate coupon (สำหรับหน้า Cart ที่คุณส่งมา)
router.post("/validate", (req, res) => {
  try {
    const { code } = req.body;
    
    // ค้นหาคูปองที่รหัสตรงกัน (แปลงเป็นตัวพิมพ์ใหญ่เพื่อให้ใช้ง่าย)
    const foundCoupon = coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );

    if (!foundCoupon) {
      return res.status(404).json({ message: "คูปองไม่ถูกต้อง ❌" });
    }

    // ส่งค่า discount กลับไป (หน้า Cart ของคุณรอรับ data.discount อยู่)
    res.json({ 
      message: "ใช้คูปองสำเร็จ 🎉", 
      discount: foundCoupon.discount 
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 2. POST create coupon (สำหรับหน้า Owner/CreateCoupon.jsx)
router.post("/", authMiddleware("owner"), (req, res) => {
  try {
    const { code, discount } = req.body;
    
    const newCoupon = {
      id: Date.now(),
      code: code.toUpperCase(),
      discount: Number(discount)
    };

    coupons.push(newCoupon);
    res.json({ message: "สร้างคูปองสำเร็จ", coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 3. GET all coupons (สำหรับให้ Owner ดูคูปองทั้งหมดที่มี)
router.get("/", authMiddleware("owner"), (req, res) => {
  res.json(coupons);
});

module.exports = router;