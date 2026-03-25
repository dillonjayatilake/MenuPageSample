import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function ChefDashboard({ userRole = "customer" }) {
  const [orders, setOrders] = useState([]);
  const canEditServiceStatus = userRole === "chef";

  const fetchOrders = async () => {
    const res = await axios.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    if (!canEditServiceStatus) {
      return;
    }

    await axios.put(
      `/orders/${id}`,
      { status },
      { headers: { "x-user-role": userRole } }
    );
    fetchOrders();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="p-4 border rounded mb-2">
          <div className="flex justify-between">
            <span>Table: {order.tableId}</span>
            <span>Status: {order.status}</span>
          </div>
          <div className="mt-2">
            {order.items.map(i => (
              <div key={i.name}>{i.name} x {i.qty}</div>
            ))}
          </div>
          {canEditServiceStatus && order.status !== "served" && (
            <div className="mt-2 flex gap-2">
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order._id, "preparing")}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Preparing
                </button>
              )}
              {order.status === "preparing" && (
                <button
                  onClick={() => updateStatus(order._id, "served")}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Served
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}