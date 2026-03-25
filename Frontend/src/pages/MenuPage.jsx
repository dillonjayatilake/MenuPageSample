import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MenuPage( { tableId } ) {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const res = await axios.get('/menu');
            setMenuItems(res.data);
        };

        fetchMenu();
    }, []);

    const addToCart = (item) => {
        const exists = cart.find(i => i._id === item._id);
        if(exists) {
        setCart(cart.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i));
        } else {
        setCart([...cart, { ...item, qty: 1 }]);
        }
    };

   const placeOrder = async () => {
  if (!cart || cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const items = cart.map(({ name, qty }) => ({ name, qty }));
  await axios.post("/orders", { tableId, restaurantId: "res1", items });

  alert("Order placed!");
  setCart([]);
};


return (
<div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <div className="grid grid-cols-1 gap-4">
        {menuItems.map(item => (
          <div key={item._id} className="p-4 border rounded flex justify-between">
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p>LKR {item.price}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => addToCart(item)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold mb-2">Cart</h2>
          {cart.map(item => (
            <div key={item.name} className="flex justify-between">
              <span>{item.name} x {item.qty}</span>
              <span>LKR {item.price * item.qty}</span>
            </div>
          ))}
          <button
            onClick={placeOrder}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );

};
