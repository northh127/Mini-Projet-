import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // ใช้ Toaster ตามที่คุณตั้งค่าไว้ใน App.jsx

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation เบื้องต้นแบบที่คุณชอบ
    if (!form.name || !form.price || !image) {
      toast.error("กรุณากรอกข้อมูลและเพิ่มรูปสินค้า");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("image", image); // 🔥 ส่งไฟล์รูปสินค้า

      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // ยืนยันว่าเป็น Owner
        },
        body: formData, // ส่งเป็น FormData เพราะมีรูป
      });

      if (!res.ok) throw new Error("Failed to add product");

      toast.success("เพิ่มสินค้าสำเร็จ 🎉");
      navigate("/owner"); // เพิ่มเสร็จกลับไปหน้า Dashboard

    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ส่วนอัปโหลดรูปภาพ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                id="product-img"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label htmlFor="product-img" className="cursor-pointer text-center">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="preview" className="h-40 object-contain rounded-lg" />
                ) : (
                  <p className="text-gray-400">📤 Click to upload product image</p>
                )}
              </label>
            </div>
          </div>

          {/* ชื่อสินค้า */}
          <input 
            type="text" 
            placeholder="Product Name"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />

          {/* ราคา */}
          <input 
            type="number" 
            placeholder="Price (฿)"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
          />

          {/* หมวดหมู่ */}
          <select 
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
          >
            <option value="">Select Category</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="shoes">Shoes</option>
          </select>

          {/* รายละเอียด */}
          <textarea 
            placeholder="Description"
            rows="4"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          ></textarea>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-semibold transition ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-blue-500'}`}
          >
            {loading ? "Adding Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;