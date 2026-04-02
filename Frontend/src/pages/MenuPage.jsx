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
  <div className="min-h-screen p-6" style={{ backgroundColor: '#edc08c' }}>
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="h-1 w-20 bg-stone-800 mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold text-stone-900 font-serif">Our Menu</h1>
          <div className="h-1 w-20 bg-stone-800 mx-auto mt-4"></div>
        </div>
        <p className="text-stone-800 mt-3 font-medium">Crafted with love & tradition</p>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map(item => (
          <div 
            key={item._id} 
            className="group bg-amber-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-700/20"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-stone-800 font-serif">{item.name}</h2>
                  <div className="h-0.5 w-12 bg-stone-700 mt-2 mb-3"></div>
                </div>
                <button
                  className="bg-stone-800 hover:bg-stone-900 text-amber-50 px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md font-medium text-sm"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-stone-800">
                  LKR {item.price}
                </p>
                {item.description && (
                  <p className="text-stone-600 text-sm italic">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="mt-10 bg-stone-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-stone-900 px-6 py-4">
            <h2 className="text-2xl font-bold text-amber-50 font-serif flex items-center gap-2">
              🛒 Your Order
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3 mb-6">
              {cart.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-3 border-b border-stone-600 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-semibold text-lg">×{item.qty}</span>
                    <span className="text-amber-50 font-medium">{item.name}</span>
                  </div>
                  <span className="text-amber-200 font-semibold">
                    LKR {item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-stone-600 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-amber-100 text-lg font-semibold">Total Amount</span>
                <span className="text-amber-50 text-2xl font-bold">
                  LKR {cart.reduce((total, item) => total + (item.price * item.qty), 0)}
                </span>
              </div>
            </div>
            
            <button
              onClick={placeOrder}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              <span>🍽️</span>
              Place Order
              <span>✨</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty Cart Message */}
      {cart.length === 0 && menuItems.length > 0 && (
        <div className="mt-10 text-center py-8 bg-amber-50/80 rounded-lg border border-stone-700/20 backdrop-blur-sm">
          <p className="text-stone-800 font-medium">Your cart is empty. Add some delicious items!</p>
        </div>
      )}
    </div>
  </div>
);
}