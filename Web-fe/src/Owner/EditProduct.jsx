import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function EditProduct() {
  const { id } = useParams(); // ดึง ID สินค้าจาก URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null); // สำหรับรูปใหม่ที่เลือก
  const [oldImage, setOldImage] = useState(""); // สำหรับโชว์รูปเดิม

  // 1. ดึงข้อมูลสินค้าเดิมมาแสดงใน Form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products`);
        const data = await res.json();
        const product = data.find((p) => p.id == id);
        
        if (product) {
          setForm({
            name: product.name,
            price: product.price,
            description: product.description || "",
            category: product.category || "",
          });
          setOldImage(product.image);
        }
      } catch (err) {
        toast.error("ไม่สามารถดึงข้อมูลสินค้าได้");
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (image) formData.append("image", image); // 🔥 ส่งรูปใหม่ไปถ้ามีการเปลี่ยน

      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT", // ใช้ PUT ตามที่เราเขียนใน Backend
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("แก้ไขสินค้าเรียบร้อย 🎉");
      navigate("/owner"); 

    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการแก้ไข");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 font-mono text-center">Edit Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ส่วนรูปภาพ */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <div className="text-center italic text-xs text-gray-400">
                <p>Old Image</p>
                <img src={`http://localhost:5000${oldImage}`} alt="old" className="w-24 h-24 object-cover rounded-xl border" />
              </div>
              {image && (
                <div className="text-center italic text-xs text-blue-400">
                  <p>New Preview</p>
                  <img src={URL.createObjectURL(image)} alt="new" className="w-24 h-24 object-cover rounded-xl border border-blue-400" />
                </div>
              )}
            </div>
            <label className="bg-gray-100 px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-gray-200 transition">
              Change Image
              <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>

          <input 
            type="text" 
            placeholder="Name"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />

          <input 
            type="number" 
            placeholder="Price"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
          />

          <textarea 
            placeholder="Description"
            rows="3"
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          ></textarea>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-semibold transition ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-blue-400'}`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;