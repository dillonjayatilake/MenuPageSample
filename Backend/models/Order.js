const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        tableId: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: String,
            required: true,
            default: 'res1',
        },
        items: [
            {
                name: {
                    type: String,
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'preparing', 'ready', 'served'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);