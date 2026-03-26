import { useContext, useState ,useEffect} from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Cart() {
  const { cart, removeFromCart, decreaseQty, addToCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  // 🔥 coupon
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // 💰 total เดิม
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 💰 total หลังลด
  const finalPrice = total - (total * discount) / 100;

  // 🔥 ใช้คูปอง
  const handleApplyCoupon = async () => {
    try {
      const res = await fetch("http://localhost:5000/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: coupon }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("คูปองไม่ถูกต้อง ❌");
        return;
      }

      setDiscount(data.discount);
      alert("ใช้คูปองสำเร็จ 🎉");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h2 className="text-3xl font-semibold mb-10 text-gray-900">
          Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="bg-blue-200 border border-gray-200 p-10 rounded-2xl text-center shadow-sm">
            <p className="text-gray-800 text-lg">
              “Your cart is still empty—let’s find something you’ll love!
              ₍ᐢ. .ᐢ₎”
            </p>
          </div>
        ) : (
          <>
            {/* LIST */}
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-300 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 mt-1">
                        ฿ {item.price}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-6">

                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        −
                      </button>

                      <span className="px-4 text-gray-800">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-gray-400 hover:text-red-500 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 COUPON (เพิ่มแบบเนียน ๆ) */}
            <div className="bg-white mt-6 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-md text-gray-600 mb-3">
                Discount Code
              </h3>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />

                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-800 text-white px-5 py-2 rounded-xl hover:bg-blue-400 transition"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* SUMMARY (ดีไซน์เดิม + เพิ่มส่วนลด) */}
            <div className="bg-white mt-10 p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">

              <div>
                <h3 className="text-lg text-gray-500">Total</h3>

                <p className="text-xl text-gray-700">
                  ฿ {total}
                </p>

                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    -{discount}% discount
                  </p>
                )}

                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ฿ {finalPrice}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/payment", {
                    state: { total: finalPrice, coupon }
                  })
                }
                className="bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-blue-400 transition shadow"
              >
                Checkout
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;