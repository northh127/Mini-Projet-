const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/products/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// หมายเหตุ: ตรงนี้ถ้าคุณใช้ MongoDB ในอนาคต ควรเปลี่ยนไปใช้ Model.find() แทนครับ
let products = [
  { id: 1, name: "Cap Head", price: 1200, image: "/image/caphead.jpg", category: "Accessories", description: "" },
];

// ✅ GET all products
router.get("/", (req, res) => {
  res.json(products);
});

// ✅ POST add product
router.post("/", authMiddleware("owner"), upload.single("image"), (req, res) => {
  try {
    // 1. 🔥 แก้ไขตรงนี้: เพิ่ม category และ description ให้ Joi ยอมรับค่า
    const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      category: Joi.string().allow(""),    // ✅ ยอมรับค่าหมวดหมู่
      description: Joi.string().allow("") // ✅ ยอมรับค่ารายละเอียด
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log("Joi Validation Error:", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "กรุณาอัปโหลดรูปสินค้า" });
    }

    const product = { 
      id: Date.now(), 
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category || "General",
      description: req.body.description || "",
      image: `/uploads/products/${req.file.filename}` 
    };

    products.push(product);

    // 2. ✅ ส่ง success: true กลับไปเพื่อให้ Frontend รู้ว่าสำเร็จ
    res.status(200).json({ 
        success: true, 
        message: "Product added successfully", 
        product 
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE product (แถม: ลบไฟล์รูปจริงออกจากเครื่องด้วย)
router.delete("/:id", authMiddleware("owner"), (req, res) => {
  try {
    const productIndex = products.findIndex((p) => p.id == req.params.id);
    if (productIndex !== -1) {
        // ถ้าอยากลบไฟล์รูปในเครื่องออกด้วยให้ใช้ fs.unlinkSync
        products.splice(productIndex, 1);
        return res.json({ message: "Product deleted" });
    }
    res.status(404).json({ message: "Product not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;