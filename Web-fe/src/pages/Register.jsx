import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 👁 state สำหรับ show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
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

      alert("Registered successfully 🎉");
      navigate("/login");

    } catch (err) {
      console.log("ERROR:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-blue-950 tracking-[0.25em]">
            CREATE ACCOUNT
          </h1>
          <p className="text-gray-400 text-xs mt-4 tracking-[0.3em] uppercase">
            join our store
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-200 rounded-lg"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-200 rounded-lg"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* PASSWORD + SHOW/HIDE */}
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border border-gray-200 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-blue-600 mt-1 hover:underline"
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-blue-500 transition">
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full mt-2 text-gray-600 hover:text-blue-600 underline"
          >
            Back to Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;
