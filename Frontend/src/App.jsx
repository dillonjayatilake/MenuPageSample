import { useState } from "react";
import MenuPage from "./pages/MenuPage";
import ChefDashboard from "./pages/ChefDashboard";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const [currentUserRole, setCurrentUserRole] = useState("customer");
  const [view, setView] = useState("menu");
  const tableId = "t1";

  const switchToCustomer = () => {
    setCurrentUserRole("customer");
    setView("menu");
  };

  const switchToChef = () => {
    setCurrentUserRole("chef");
    setView("chef");
  };

  return (
    <div>
      <div className="p-2 flex gap-2">
        <button className="bg-gray-200 px-2 py-1" onClick={switchToCustomer}>Customer</button>
        <button className="bg-gray-200 px-2 py-1" onClick={switchToChef}>Chef</button>

        {currentUserRole === "customer" && (
          <>
            <button className="bg-gray-200 px-2 py-1" onClick={() => setView("menu")}>Menu</button>
            <button className="bg-gray-200 px-2 py-1" onClick={() => setView("orders")}>Orders</button>
          </>
        )}

        {currentUserRole === "chef" && (
          <button className="bg-gray-200 px-2 py-1" onClick={() => setView("chef")}>Chef Dashboard</button>
        )}
      </div>

      {currentUserRole === "customer" && view === "menu" && <MenuPage tableId={tableId} />}
      {currentUserRole === "customer" && view === "orders" && <OrdersPage tableId={tableId} />}
      {currentUserRole === "chef" && view === "chef" && <ChefDashboard userRole={currentUserRole} />}
    </div>
  );
}

export default App;