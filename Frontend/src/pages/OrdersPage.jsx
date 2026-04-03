import { useEffect, useState } from "react";
import axios from "../api/axios";
import { io } from "socket.io-client";

export default function OrdersPage({ tableId }) {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});

  const DELETION_WINDOW = 15 * 60; // 15 minutes in seconds

  const fetchOrders = async () => {
    const res = await axios.get("/orders", { params: { tableId } });
    setOrders(res.data);
  };

  // Calculate remaining deletion time for each order
  const getTimeRemaining = (createdAt) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const elapsedSeconds = Math.floor((now - orderTime) / 1000);
    const remaining = Math.max(0, DELETION_WINDOW - elapsedSeconds);
    return remaining;
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canDeleteOrder = (order) => {
    return order.status === 'pending' && (timeRemaining[order._id] || 0) > 0;
  };

  const deleteOrder = async (orderId) => {
    const remaining = timeRemaining[orderId];
    if (remaining <= 0) {
      alert('Cannot delete order. 15-minute deletion window has expired.');
      return;
    }

    if(window.confirm(`Are you sure you want to delete this order? This action cannot be undone.`)) {
      try {
        await axios.delete(`/orders/${orderId}`, {
          headers: {
            'x-user-role': 'customer' //Simulating customer role for deletion. In real app, this should come from auth context or similar.
          }
        });
        setOrders(orders.filter(order => order._id !== orderId));
        alert(`Order deleted successfully.`);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert(error.response?.data?.message || 'Failed to delete order. Please try again.');
      }
    }
  };

  const markAsServed = async (orderId) => {
    try {
      const res = await axios.put(`/orders/${orderId}`, { status: 'Served' });
      setOrders(orders.map(order => order._id === orderId ? res.data : order));
      alert('Order marked as served!');
    } catch (error) {
      console.error('Error marking order as served:', error);
      alert('Failed to mark order as served. Please try again.');
    }
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
      if (order.tableId === tableId) {
        setOrders(prevOrders => [order, ...prevOrders]);
      }
    });

    newSocket.on("order:updated", (updatedOrder) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

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
  }, [tableId]);

  // Update countdown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      orders.forEach(order => {
        newTimeRemaining[order._id] = getTimeRemaining(order.createdAt);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [orders]);

 return (
  <div className="min-h-screen p-6" style={{ backgroundColor: '#ccb06a' }}>
    <div className="max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="h-1 w-16 bg-stone-700 mx-auto mb-3"></div>
          <h1 className="text-3xl font-bold text-stone-800 font-serif flex items-center justify-center gap-2">
            <span>☕</span>
            My Orders
            <span>🍰</span>
          </h1>
          <div className="h-1 w-16 bg-stone-700 mx-auto mt-3"></div>
        </div>
        <p className="text-stone-700 mt-3 font-medium">Track your delicious orders</p>
      </div>

      {/* Loading or Empty State */}
      {orders.length === 0 && (
        <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg border border-stone-700/20 shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-stone-800 mb-2">No orders yet</h3>
          <p className="text-stone-600">Looks like you haven't placed any orders.</p>
          <p className="text-stone-500 text-sm mt-2">Browse our menu and treat yourself! ✨</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div 
            key={order._id} 
            className="bg-amber-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-700/20 transform hover:-translate-y-1 group"
          >
            {/* Order Header */}
            <div className="bg-stone-800 px-5 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <p className="text-amber-100 text-xs">Table Number</p>
                  <p className="text-amber-50 font-semibold">{order.tableId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    order.status === 'Preparing' ? 'bg-amber-500' :
                    order.status === 'Ready' ? 'bg-green-500' :
                    order.status === 'Served' ? 'bg-blue-500' :
                    'bg-stone-500'
                  }`}></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Preparing' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'Ready' ? 'bg-green-100 text-green-800' :
                    order.status === 'Served' ? 'bg-blue-100 text-blue-800' :
                    'bg-stone-100 text-stone-800'
                  }`}>
                    {order.status || 'Received'} {order.status === 'Preparing' && '👨‍🍳'}
                  </span>
                </div>

                {/* Delete Button with Timer */}
                <div className="ml-2 flex items-center gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        disabled={!canDeleteOrder(order)}
                        className={`${
                          canDeleteOrder(order)
                            ? 'bg-red-600 hover:bg-red-700 cursor-pointer opacity-100'
                            : 'bg-gray-400 cursor-not-allowed opacity-60'
                        } text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-1`}
                        title={canDeleteOrder(order) ? "Delete Order" : "Deletion window expired"}
                      >
                        <span>🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                      
                      {/* Timer Display */}
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                        (timeRemaining[order._id] || 0) > 300 ? 'bg-green-100 text-green-800' :
                        (timeRemaining[order._id] || 0) > 60 ? 'bg-yellow-100 text-yellow-800' :
                        (timeRemaining[order._id] || 0) > 0 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        ⏱️ {formatTime(timeRemaining[order._id] || 0)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-5">
              {/* Order Items */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider pb-2 border-b border-stone-200">
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Price</span>
                </div>
                {order.items.map((item, idx) => (
                  <div 
                    key={`${order._id}-${item.name}`} 
                    className="flex justify-between items-center py-2 hover:bg-stone-50 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-stone-400 text-sm">{idx + 1}.</span>
                      <span className="text-stone-700 font-medium">{item.name}</span>
                    </div>
                    <span className="text-stone-600 font-semibold mx-4">×{item.qty}</span>
                    <span className="text-stone-700 font-semibold">LKR {item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                <div className="text-sm text-stone-500">
                  {order.timestamp ? (
                    <span className="flex items-center gap-1">
                      <span>🕐</span> {new Date(order.timestamp).toLocaleTimeString()}
                    </span>
                  ) : (
                    <span>Just now</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">Total Amount</p>
                  <p className="text-xl font-bold text-stone-800">
                    LKR {order.items.reduce((total, item) => total + (item.price * item.qty), 0)}
                  </p>
                </div>
              </div>

              {/* Action Buttons (if order is ready) */}
              {order.status === 'Ready' && (
                <button 
                  onClick={() => markAsServed(order._id)}
                  className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>✅</span>
                  Mark as Served
                  <span>🎉</span>
                </button>
              )}

              {/* Deletion Window Expired Message */}
              {order.status === 'pending' && (timeRemaining[order._id] || 0) <= 0 && (
                <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-3 text-center">
                  <p className="text-red-700 text-sm font-semibold">
                    <span>🚫</span> Deletion window has expired
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    Order is now being prepared by the chef. Contact us for cancellation.
                  </p>
                </div>
              )}

              {/* Progress Indicator for Preparing orders */}
              {order.status === 'Preparing' && (
                <>
                  <div className="mt-4 bg-orange-50 border border-orange-300 rounded-lg p-3 text-center">
                    <p className="text-orange-700 text-sm font-semibold">
                      <span>👨‍🍳</span> Cannot Delete Order
                    </p>
                    <p className="text-orange-600 text-xs mt-1">
                      Your order is already being prepared by the chef and cannot be cancelled.
                    </p>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>Preparing your order...</span>
                      <span>⏳</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Card (if orders exist) */}
      {orders.length > 0 && (
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
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-xs text-amber-200">Total Spent</p>
                <p className="text-xl font-bold">
                  LKR {orders.reduce((total, order) => 
                    total + order.items.reduce((sum, item) => sum + (item.price * item.qty), 0), 0
                  )}
                </p>
              </div>
            </div>
            <div className="w-px h-10 bg-amber-700"></div>
            
              
          </div>
        </div>
      )}
    </div>
  </div>
);
}