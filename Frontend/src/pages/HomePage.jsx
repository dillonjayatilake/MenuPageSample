import { useState } from "react";
import MenuPage from "./MenuPage";
import OrdersPage from "./OrdersPage";

function HomePage() {
  const [view, setView] = useState("menu");
  const tableId = "t1";

  return (
    <div>
      <div className="p-2 flex gap-2">
        <button className="bg-gray-200 px-2 py-1" onClick={() => setView("menu")}>Menu</button>
        <button className="bg-gray-200 px-2 py-1" onClick={() => setView("orders")}>Orders</button>
      </div>

      {view === "menu" && <MenuPage tableId={tableId} />}
      {view === "orders" && <OrdersPage tableId={tableId} />}
    </div>
  );
}

export default HomePage;
