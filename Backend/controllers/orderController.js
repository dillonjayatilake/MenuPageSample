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
        
        // Emit socket event for new order
        const io = req.app.get('io');
        io.emit('order:created', order);
       
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

       

        const updated = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );
        
        // Emit socket event for status update
        const io = req.app.get('io');
        io.emit('order:updated', updated);
        
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'];
     if(userRole !== 'customer') {
            return res.status(403).json({ message: 'Only customers can delete orders' });
     }
        const deletedOrder = await orderService.deleteOrder(req.params.id);
        
        // Emit socket event for deleted order
        const io = req.app.get('io');
        io.emit('order:deleted', { _id: req.params.id });
        
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    deleteOrder
};
