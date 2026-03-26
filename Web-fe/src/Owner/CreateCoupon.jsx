import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function CreateCoupon() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    code: "",
    discount: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.code || !form.discount) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code: form.code.toUpperCase(), // บังคับเป็นตัวพิมพ์ใหญ่ตามสไตล์คูปอง
          discount: Number(form.discount)
        }),
      });

      if (!res.ok) throw new Error("Failed to create coupon");

      toast.success("สร้างคูปองสำเร็จ! 🎫");
      setForm({ code: "", discount: "" }); // ล้างฟอร์ม
      
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการสร้างคูปอง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-6">
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-300">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎫</div>
          <h2 className="text-2xl font-bold text-gray-900 font-mono">Create New Coupon</h2>
          <p className="text-gray-400 text-sm italic">สร้างส่วนลดเพื่อดึงดูดลูกค้า</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ชื่อโค้ด */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">
              Coupon Code
            </label>
            <input 
              type="text" 
              placeholder="e.g. SUMMER50"
              className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition uppercase"
              value={form.code}
              onChange={(e) => setForm({...form, code: e.target.value})}
            />
          </div>

          {/* จำนวนส่วนลด */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">
              Discount Amount (%)
            </label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="10"
                className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={form.discount}
                onChange={(e) => setForm({...form, discount: e.target.value})}
              />
              <span className="absolute right-4 top-4 text-gray-400 font-bold">%</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold tracking-widest transition shadow-lg ${
              loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-blue-500'
            }`}
          >
            {loading ? "CREATING..." : "GENERATE COUPON"}
          </button>
        </form>

        <button 
          onClick={() => navigate("/owner")}
          className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateCoupon;