import { useState } from "react";
import MenuPage from "./MenuPage";
import OrdersPage from "./OrdersPage";

function HomePage() {
  const [view, setView] = useState("menu");
  const tableId = "t1";

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ccb06a' }}>
      {view === "menu" && (
        <div className="relative">
          {/* Floating Orders Button */}
          <button
            onClick={() => setView("orders")}
            className="fixed bottom-6 right-6 z-50 bg-stone-800 hover:bg-stone-900 text-amber-50 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold group"
          >
            <span className="text-xl">📋</span>
            <span>View Orders</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
          <MenuPage tableId={tableId} />
        </div>
      )}

      {view === "orders" && (
        <div className="relative">
          {/* Floating Menu Button */}
          <button
            onClick={() => setView("menu")}
            className="fixed bottom-6 right-6 z-50 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold group"
          >
            <span className="text-xl">🍽️</span>
            <span>Back to Menu</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">←</span>
          </button>
          
          <OrdersPage tableId={tableId} />
        </div>
      )}
    </div>
  );
}

export default HomePage;