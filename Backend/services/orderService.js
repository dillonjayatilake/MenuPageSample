const Order = require('../models/Order');

const createOrder = async (data) =>
{
    const order = new Order(data);
    return await order.save();
}

const getOrders = async (tableId) => {
    const query = { restaurantId: 'res1' };

    if (tableId) {
        query.tableId = tableId;
    }

    return await Order.find(query).sort({ createdAt: -1 });
};

const updateOrderStatus = async (id, status) => {
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
};

const deleteOrder = async (id) => {
    return await Order.findByIdAndDelete(id);
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    deleteOrder
};