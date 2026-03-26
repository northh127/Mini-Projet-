const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

console.log("🔥 AUTH ROUTES FILE LOADED");
router.get("/", (req, res) => {
  res.send("ok");
});

// REGISTER
router.post("/register", async (req, res) => {
 console.log("register path running");
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Register successful",
      token,
      user: { id: newUser._id, username: newUser.username, role: newUser.role }
    });
  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error (register)" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error (login)" });
  }
});

module.exports = router;
