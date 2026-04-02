const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const { deleteOrder} = require('../services/orderService');

//Only Admin can delete
router.delete(
    "/orders/:id",
    protect,
    allowRoles('customer'),
    deleteOrder 
);

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;