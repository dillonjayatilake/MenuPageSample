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
  <div className="min-h-screen p-6" style={{ backgroundColor: '#ccb06a' }}>
    <div className="max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="h-1 w-16 bg-stone-700 mx-auto mb-3"></div>
          <h1 className="text-3xl font-bold text-stone-800 font-serif flex items-center justify-center gap-2">
            <span>📋</span>
            Chef Dashboard
            <span>👨‍🍳 </span>
          </h1>
          <div className="h-1 w-16 bg-stone-700 mx-auto mt-3"></div>
        </div>
        <p className="text-stone-700 mt-3 font-medium">Manage and track customer orders</p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg border border-stone-700/20 shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-stone-800 mb-2">No orders yet</h3>
          <p className="text-stone-600">Waiting for customers to place orders</p>
          <p className="text-stone-500 text-sm mt-2">Orders will appear here once placed ✨</p>
        </div>
      ) : (
        <>
          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div 
                key={order._id} 
                className="bg-amber-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-700/20 transform hover:-translate-y-1"
              >
                {/* Order Header */}
                <div className="bg-stone-800 px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-amber-100 text-xs">Table Number</p>
                      <p className="text-amber-50 font-semibold text-lg">{order.tableId}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      order.status === 'preparing' ? 'bg-amber-500' :
                      order.status === 'served' ? 'bg-green-500' :
                      'bg-stone-500'
                    }`}></div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      order.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'served' ? 'bg-green-100 text-green-800' :
                      'bg-stone-100 text-stone-800'
                    }`}>
                      {order.status === 'preparing' && '👨‍🍳 '}
                      {order.status === 'served' && '✅ '}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5">
                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider pb-2 border-b border-stone-200">
                      <span>Item</span>
                      <span>Quantity</span>
                    </div>
                    {order.items.map((item, idx) => (
                      <div 
                        key={item.name} 
                        className="flex justify-between items-center py-2 hover:bg-stone-50 px-2 rounded transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 text-sm">{idx + 1}.</span>
                          <span className="text-stone-700 font-medium">{item.name}</span>
                        </div>
                        <span className="text-stone-600 font-semibold">
                          ×{item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer with Timestamp */}
                  <div className="border-t border-stone-200 pt-3">
                    <div className="text-sm text-stone-500 flex items-center gap-1">
                      <span>🕐</span> 
                      {order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : 'Just now'}
                    </div>
                  </div>



                  {/* Action Buttons based on status */}
                  {canEditServiceStatus && order.status !== "served" && (
                    <div className="mt-4 flex gap-3">
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateStatus(order._id, "preparing")}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md"
                          title="Start preparing"
                        >
                          <span>👨‍🍳</span>
                          Start Preparing
                          <span>→</span>
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() => updateStatus(order._id, "served")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md"
                        >
                          <span>✅</span>
                          Mark as Served
                          <span>🎉</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Progress Indicator for preparing orders */}
                  {order.status === "preparing" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-stone-500 mb-1">
                        <span>Preparing order...</span>
                        <span>⏳ In Progress</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  )}

                  {/* Served indicator */}
                  {order.status === "served" && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                      <p className="text-green-700 text-sm font-medium flex items-center justify-center gap-2">
                        <span>✅</span>
                        Order has been served to customer
                        <span>🎉</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="mt-6 bg-stone-800 rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center text-amber-50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-xs text-amber-200">Total Orders</p>
                  <p className="text-xl font-bold">{orders.length}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-amber-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="text-xs text-amber-200">In Progress</p>
                  <p className="text-xl font-bold">
                    {orders.filter(o => o.status === 'preparing').length}
                  </p>
                </div>
              </div>
              <div className="w-px h-10 bg-amber-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-xs text-amber-200">Completed</p>
                  <p className="text-xl font-bold">
                    {orders.filter(o => o.status === 'served').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>

)
};
