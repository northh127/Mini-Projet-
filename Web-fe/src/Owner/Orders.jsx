import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลออเดอร์ทั้งหมด (เฉพาะ Owner)
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/orders", {
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error("ไม่สามารถดึงข้อมูลออเดอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  // 2. ฟังก์ชันกดยืนยันหรือปฏิเสธการชำระเงิน
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`อัปเดตสถานะเป็น ${newStatus} แล้ว 🎉`);
        fetchOrders(); // รีเฟรชรายการใหม่
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-gray-900 font-mono">
          Customer Orders Management 📜
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-300">
            <p className="text-gray-500">ยังไม่มีคำสั่งซื้อในขณะนี้ ₍ᐢ. .ᐢ₎</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
              >
                {/* ฝั่งซ้าย: ข้อมูลออเดอร์ */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-mono">
                      ID: {order.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900">
                    Total: ฿ {order.total}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Customer: {order.user || "Guest"}
                  </p>
                  {order.coupon && (
                    <p className="text-green-600 text-xs mt-1 italic">
                      Used Coupon: {order.coupon}
                    </p>
                  )}
                </div>

                {/* ฝั่งกลาง: รูปสลิป (คลิกเพื่อดูรูปใหญ่ได้) */}
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Payment Slip</p>
                  {order.slip ? (
                    <a 
                      href={`http://localhost:5000/uploads/${order.slip}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group relative"
                    >
                      <img 
                        src={`http://localhost:5000/uploads/${order.slip}`} 
                        alt="slip" 
                        className="w-24 h-32 object-cover rounded-xl border border-gray-200 group-hover:opacity-80 transition"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white bg-black/20 rounded-xl text-xs">
                        View Full
                      </div>
                    </a>
                  ) : (
                    <div className="w-24 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-xs text-center p-2">
                      No Slip Uploaded
                    </div>
                  )}
                </div>

                {/* ฝั่งขวา: ปุ่มจัดการสถานะ */}
                <div className="flex flex-col justify-center gap-3">
                  <button 
                    onClick={() => handleUpdateStatus(order.id, "completed")}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-blue-400 transition text-sm font-semibold shadow-sm"
                  >
                    Confirm Order
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order.id, "rejected")}
                    className="text-gray-400 hover:text-red-500 transition text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;