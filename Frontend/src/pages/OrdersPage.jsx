import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function OrdersPage({ tableId }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("/orders", { params: { tableId } });
    setOrders(res.data);
  };

  const deleteOrder = async (orderId) => {
    if(window.confirm(`Are you sure you want to delete this order? This action cannot be undone.`)) {
      try {
        await axios.delete(`/orders/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
        alert(`Order deleted successfully.`);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
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
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [tableId]);

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

                {/* Delete Button */}
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-1 opacity-70 hover:opacity-100"
                  title="Delete Order"
                >
                  <span>🗑️</span>
                  <span className="hidden sm:inline">Delete</span>
                </button>
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

              {/* Progress Indicator for Preparing orders */}
              {order.status === 'Preparing' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>Preparing your order...</span>
                    <span>⏳</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                </div>
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