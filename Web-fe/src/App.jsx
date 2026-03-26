import { Routes, Route, Navigate } from "react-router-dom"; // เพิ่ม Navigate

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Payment from "./pages/Payment";
import Owner from "./Owner/Owner";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";


// 🔥 Import ไฟล์ใหม่ในโฟลเดอร์ Owner (อ้างอิงตามโครงสร้างที่คุณวางไว้)
import Orders from "./Owner/Orders";
import CreateCoupon from "./Owner/CreateCoupon";
import AddProduct from "./Owner/AddProduct";
import EditProduct from "./Owner/EditProduct";

// ✅ ฟังก์ชันเช็คสิทธิ์ Owner แบบง่ายๆ (สไตล์จำลองระบบ)
const OwnerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "owner" ? children : <Navigate to="/login" />;
};

function App() {
  const products = [
    { id: 1, name: "Cap Head POLO RALPH LUAREN", price: 1200, image: "/image/caphead.jpg" },
    { id: 2, name: "POLO RALPH LUAREN EMERALD AND NAVY RUGBY", price: 16700, image: "/image/cool.jpg" },
    { id: 3, name: "POLO RALPH LAUREN", price: 52000, image: "/image/handsum.jpg" },
  ];

  const addToCart = (product) => {
    console.log("Add:", product);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      

        {/* 👑 Owner Routes (แทรกเพิ่มเข้าไปตรงนี้ครับ) */}
        <Route path="/owner" element={<OwnerRoute><Owner /></OwnerRoute>} />
        <Route path="/owner/orders" element={<OwnerRoute><Orders /></OwnerRoute>} />
        <Route path="/owner/create-coupon" element={<OwnerRoute><CreateCoupon /></OwnerRoute>} />
        <Route path="/owner/add-product" element={<OwnerRoute><AddProduct /></OwnerRoute>} />
        <Route path="/owner/edit-product/:id" element={<OwnerRoute><EditProduct /></OwnerRoute>} />

      </Routes>
    </>
  );
}

export default App;