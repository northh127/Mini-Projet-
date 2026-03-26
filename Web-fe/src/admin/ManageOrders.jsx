import { useEffect, useState } from "react";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const approveOrder = async (id) => {
    try {
      await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">วันที่</th>
            <th className="border p-2">ราคา</th>
            <th className="border p-2">ยอดรวม</th>
            <th className="border p-2">สลิป</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border p-2">{o.id}</td>
              <td className="border p-2">{o.date}</td>
              <td className="border p-2">฿ {o.price}</td>
              <td className="border p-2">฿ {o.total}</td>
              <td className="border p-2">
                {o.slip && (
                  <img
                    src={`http://localhost:5000/${o.slip}`}
                    alt="slip"
                    className="w-24"
                  />
                )}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => approveOrder(o.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  อนุมัติการสั่งซื้อ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrders;
