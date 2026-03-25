import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function OrdersPage({ tableId }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("/orders", { params: { tableId } });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [tableId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 && (
        <div className="p-4 border rounded">No orders yet.</div>
      )}

      {orders.map((order) => (
        <div key={order._id} className="p-4 border rounded mb-2">
          <div className="flex justify-between">
            <span>Table: {order.tableId}</span>
            <span>Status: {order.status}</span>
          </div>
          <div className="mt-2">
            {order.items.map((item) => (
              <div key={`${order._id}-${item.name}`}>{item.name} x {item.qty}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
