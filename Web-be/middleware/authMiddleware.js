const jwt = require("jsonwebtoken");

const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // 1. รับ Token จาก Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 2. แปลง Token เป็นข้อมูล User
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
      req.user = decoded;

      // 3. เช็ค Role (ถ้าไม่ระบุ role แสดงว่าใครก็ได้ที่ login หรือถ้าตรงกับที่กำหนดก็ให้ผ่าน)
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
      }

      next(); // ผ่านฉลุย ไปทำฟังก์ชันถัดไปได้
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  };
};

module.exports = authMiddleware;