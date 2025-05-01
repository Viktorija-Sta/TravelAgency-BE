const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination',
            required: true,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
          
        totalAmount: {
            type: Number,
            required: true,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        shippingAddress: {
            type: String,
            required: true,
        },
    }
)


const Order = mongoose.model('Order', orderSchema)
module.exports = Order