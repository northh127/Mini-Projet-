import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Home() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    // 🔄 ดึงข้อมูลจาก Backend
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        // 🛡️ ข้อมูลสำรอง 3 ชิ้นหลัก (ป้องกันกรณีใน DB โดนลบ)
        const baseProducts = [
          { id: "p1", name: "Cap Head POLO RALPH LUAREN", price: 1200, image: "/image/caphead.jpg" },
          { id: "p2", name: "POLO RALPH LUAREN EMERALD AND NAVY RUGBY", price: 16700, image: "/image/cool.jpg" },
          { id: "p3", name: "POLO RALPH LAUREN", price: 52000, image: "/image/handsum.jpg" },
        ];

        // เอาข้อมูลจาก DB มากรองเอาตัวที่ไม่ซ้ำกับ 3 ชิ้นหลัก แล้วเอามารวมกัน
        const otherProducts = data.filter(
          (dbItem) => !baseProducts.some((base) => base.name === dbItem.name)
        );

        setProducts([...baseProducts, ...otherProducts]);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        // ถ้าต่อ Backend ไม่ติดเลย ให้แสดง 3 ชิ้นหลักไว้ก่อนหน้าเว็บจะได้ไม่โล่ง
        setProducts([
          { id: "p1", name: "Cap Head POLO RALPH LUAREN", price: 1200, image: "/image/caphead.jpg" },
          { id: "p2", name: "POLO RALPH LUAREN EMERALD AND NAVY RUGBY", price: 16700, image: "/image/cool.jpg" },
          { id: "p3", name: "POLO RALPH LAUREN", price: 52000, image: "/image/handsum.jpg" },
        ]);
      });
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-gray-900 text-white px-10 py-5 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold tracking-wide">REREM.</h1>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:opacity-70 transition">สินค้า</Link>
          <Link to="/cart" className="hover:opacity-70 transition">ตะกร้า</Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user.username} 👋</span>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition">
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:opacity-70 transition hover:underline">
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <section className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Trending</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product._id || product.id} 
                className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={
                    // บังคับแมพชื่อไฟล์รูปจากโฟลเดอร์ public/image
                    product.name.includes("Cap Head") ? "/image/caphead.jpg" :
                    product.name.includes("EMERALD") ? "/image/cool.jpg" :
                    product.name.includes("RALPH LAUREN") ? "/image/handsum.jpg" :
                    (product.image?.startsWith("/") ? product.image : `/image/${product.image}`)
                  }
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/image/caphead.jpg"; // รูปสำรอง
                    e.target.onerror = null;
                  }}
                />

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">{product.name}</h3>
                  <p className="text-xl font-bold text-gray-800 mt-2">฿ {product.price.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-5 w-full bg-gray-900 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                >
                  เพิ่มตะกร้า
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;