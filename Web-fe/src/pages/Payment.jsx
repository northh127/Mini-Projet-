import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

function Payment() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { total: finalPrice, coupon } = location.state || {};

  const rawTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = finalPrice || rawTotal;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า");
      navigate("/");
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. ดึงข้อมูล User และ Token จาก LocalStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // 🔥 ดึง Token มาเพื่อใช้ยืนยันตัวตน

    if (!form.name || !form.phone || !form.address) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("เบอร์โทรไม่ถูกต้อง");
      return;
    }

    if (!slip) {
      alert("กรุณาอัปโหลดสลิป");
      return;
    }

    if (slip.size > 2 * 1024 * 1024) {
      alert("ไฟล์ใหญ่เกินไป (ไม่เกิน 2MB)");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("customer", JSON.stringify(form));
      formData.append("cart", JSON.stringify(cart));
      formData.append("total", total);
      formData.append("slip", slip);
      formData.append("status", "pending");
      formData.append("user", user?.username || "guest");
      formData.append("coupon", coupon || "");

      // 2. ส่ง Request พร้อม Header Authorization
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        body: formData,
        headers: {
          // 🔥 ส่ง Token ไปใน Header เพื่อแก้ 401 Unauthorized
          // (หมายเหตุ: ตรวจสอบชื่อ key ใน localStorage อีกครั้งว่าชื่อ 'token' หรือไม่)
          "Authorization": `Bearer ${token}` 
        },
      });

      if (!res.ok) {
        // ถ้าได้ 401 อีกรอบ แสดงว่า Token อาจจะหมดอายุ หรือ Backend คาดหวังชื่อ Header อื่น
        const errorData = await res.json();
        throw new Error(errorData.message || "Order failed");
      }

      const data = await res.json();
      console.log("SUCCESS:", data);
      alert("สั่งซื้อสำเร็จ 🎉");

      setForm({ name: "", phone: "", address: "" });
      setSlip(null);
      setCart([]);
      navigate("/");

    } catch (err) {
      console.log(err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* LEFT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Customer Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              placeholder="Shipping Address"
              className="w-full border p-3 rounded-lg"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <div>
              <p className="text-sm mb-2 text-gray-600">Upload Payment Slip</p>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50">
                {!slip ? (
                  <p className="text-gray-400">📤 Click to upload</p>
                ) : (
                  <p className="text-gray-700">{slip.name}</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setSlip(e.target.files[0])}
                />
              </label>
              {slip && (
                <img
                  src={URL.createObjectURL(slip)}
                  alt="preview"
                  className="mt-4 rounded-xl max-h-40"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl transition text-white 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-blue-400"}`}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </form>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {coupon && <p className="text-green-600 mb-2">ใช้คูปอง: {coupon}</p>}
          {finalPrice && finalPrice !== rawTotal && (
            <p className="text-sm text-green-500 mb-2">มีส่วนลดแล้ว 🎉</p>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>฿ {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-5 pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>฿ {total}</span>
          </div>
          <div className="bg-blue-50 border p-5 rounded-2xl mt-6">
            <h2 className="text-lg font-semibold mb-3 text-blue-700">K Bank</h2>
            <p>Bank: Kasikorn Bank</p>
            <p>Account Name: We love REREM. COMPANY</p>
            <p>Account Number: 097-3147-795</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;