import { useEffect, useState } from "react";
import axios from "../api/axios";
import { io } from "socket.io-client";

export default function ChefDashboard({ userRole = "customer" }) {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const canEditServiceStatus = userRole === "chef";

  const fetchOrders = async () => {
    const res = await axios.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    setSocket(newSocket);

    // Fetch initial orders
    fetchOrders();

    // Listen for real-time order events
    newSocket.on("order:created", (order) => {
      setOrders(prevOrders => [order, ...prevOrders]);
    });

    // Listen for order status updates
    newSocket.on("order:updated", (updatedOrder) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Listen for order deletion (if implemented)
    newSocket.on("order:deleted", (data) => {
      setOrders(prevOrders =>
        prevOrders.filter(order => order._id !== data._id)
      );
    });

    // Fallback polling every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
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
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No orders</div>
      ) : (
        orders.map(order => (
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
        ))
      )}
    </div>
  );
}