import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("ส่งคำขอรีเซ็ตรหัสผ่านไปที่อีเมลแล้ว 🎉");
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-900">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 text-sm">
          กรุณากรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
        </p>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
          ส่งคำขอรีเซ็ตรหัสผ่าน
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
