import { useState } from "react";
import MenuPage from "./MenuPage";
import OrdersPage from "./OrdersPage";

function HomePage({ tableId, onChangeTable }) {
  const [view, setView] = useState("menu");

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ccb06a' }}>
      {/* Table ID Header */}
      <div className="bg-stone-800 text-amber-50 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">Table:</span>
          <span className="font-bold text-lg">{tableId}</span>
        </div>
        {onChangeTable && (
          <button
            onClick={onChangeTable}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs font-semibold transition-all"
          >
            🔄 Change Table
          </button>
        )}
      </div>
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