import { useState } from "react";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Reset password สำเร็จ 🎉");

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
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-blue-900">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 text-sm">
          กรุณากรอกอีเมลและรหัสใหม่ของคุณ
        </p>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* NEW PASSWORD + ลูกกะตา */}
        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-10"
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />
            {/* ลูกตา toggle */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
