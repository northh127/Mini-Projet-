import { useNavigate } from "react-router-dom";

function Owner() {
  const navigate = useNavigate();

  // ข้อมูลเมนูในสไตล์ Array เพื่อให้จัดการง่าย
  const adminMenus = [
    {
      title: "Add Product",
      desc: "เพิ่มสินค้าใหม่เข้าระบบ",
      path: "/owner/add-product",
      icon: "📦",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Manage Orders",
      desc: "ดูคำสั่งซื้อและตรวจสลิป",
      path: "/owner/orders",
      icon: "📜",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Create Coupon",
      desc: "สร้างรหัสส่วนลดให้ลูกค้า",
      path: "/owner/create-coupon",
      icon: "🎫",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-gray-900 font-mono">
          Owner Control Panel 👑
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {adminMenus.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white border border-gray-300 p-8 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-6 text-gray-400 group-hover:text-gray-900 font-semibold text-sm transition">
                Manage →
              </div>
            </div>
          ))}
        </div>

        {/* ส่วนสรุปสั้นๆ (ถ้าต้องการเพิ่ม) */}
        <div className="mt-10 bg-white border border-gray-300 p-6 rounded-2xl flex items-center justify-between">
            <p className="text-gray-600 font-medium">ต้องการกลับไปยังหน้าร้านค้า?</p>
            <button 
                onClick={() => navigate("/")}
                className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-blue-400 transition"
            >
                Back to Store
            </button>
        </div>
      </div>
    </div>
  );
}

export default Owner;