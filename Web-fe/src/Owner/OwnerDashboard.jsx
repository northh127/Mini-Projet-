import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();

  const menu = [
    { title: "จัดการสินค้า", desc: "เพิ่ม ลบ หรือแก้ไขสินค้าในร้าน", path: "/owner/add-product", color: "bg-blue-500" },
    { title: "ดูคำสั่งซื้อ", desc: "ตรวจสอบสลิปและสถานะการชำระเงิน", path: "/owner/orders", color: "bg-green-500" },
    { title: "สร้างคูปอง", desc: "ออกรหัสส่วนลดให้ลูกค้า", path: "/owner/create-coupon", color: "bg-purple-500" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Owner Dashboard 👑</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {menu.map((item, index) => (
            <div 
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg mb-4`}></div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;