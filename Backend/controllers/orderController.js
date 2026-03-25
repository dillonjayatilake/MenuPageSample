const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const { tableId, items } = req.body;

         if (!tableId || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid order data" });
        }

         const order = await orderService.createOrder({
            tableId,
            items,
            status: "pending" 
        });
       
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const { tableId } = req.query;
        const orders = await orderService.getOrders(tableId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'];

        if (userRole !== 'chef') {
            return res.status(403).json({ message: 'Only chef can update order status' });
        }

        const updated = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
};
