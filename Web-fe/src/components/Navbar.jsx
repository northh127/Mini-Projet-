import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white flex justify-center gap-10 p-4">
      {/* เมนูสำหรับลูกค้า */}
      <Link to="/products">สินค้า</Link>
      <Link to="/cart">ตะกร้า</Link>
      <Link to="/login">เข้าสู่ระบบ</Link>

      {/* เมนูสำหรับ Owner */}
      {user?.role === "owner" && (
        <>
          <Link to="/owner">Owner Dashboard</Link>
          <Link to="/owner/add">เพิ่มสินค้า</Link>
          <Link to="/owner/orders">คำสั่งซื้อ</Link>
          <Link to="/owner/coupons">คูปอง</Link>
        </>
      )}

      {/* เมนูสำหรับ Admin */}
      {user?.role === "admin" && (
        <>
          <Link to="/admin">Admin Dashboard</Link>
          <Link
            to="/admin/orders"
            className="bg-green-600 px-4 py-2 rounded"
          >
            อนุมัติการสั่งซื้อ
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
