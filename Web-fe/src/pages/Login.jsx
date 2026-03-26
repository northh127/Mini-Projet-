import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast"; // แนะนำให้ใช้ toast เพื่อความสวยงาม

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "", // หรือ email ตามที่ Backend กำหนด
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ 1. เก็บข้อมูล User และ Token ลง LocalStorage
      // เก็บก้อน user ทั้งก้อนที่มี role อยู่ข้างในด้วย
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // ✅ 2. อัปเดต State ใน AuthContext
      login({ token: data.token, user: data.user });

      // ✅ 3. เช็ค Role เพื่อแยกหน้า (หัวใจสำคัญอยู่ตรงนี้!)
      if (data.user.role === "owner") {
        alert("ยินดีต้อนรับคุณเจ้าของร้าน 👑");
        navigate("/owner"); // ส่งไปหน้า Dashboard ของ Owner
      } else {
        alert("Login successful 🎉");
        navigate("/"); // ลูกค้าทั่วไปส่งไปหน้าแรก
      }

    } catch (err) {
      console.log("ERROR:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-semibold text-blue-950 tracking-[0.25em] text-center">
          REREM.
        </h1>
        <p className="text-center text-gray-500 text-xs tracking-widest mb-10">
          MODERN ELEGANCE IN EVERY DETAIL
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700">Username / Email</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:border-blue-400"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:border-blue-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-600 mt-1 hover:underline"
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-blue-400 transition font-semibold tracking-widest">
            LOGIN
          </button>

          <div className="flex justify-between text-sm mt-2">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-gray-600 hover:text-blue-600 underline"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-gray-600 hover:text-blue-600 underline"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;