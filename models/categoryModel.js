const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        productsCount: {
            type: Number,
            default: 0,
        },
        destinationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination',
        },
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Agency',
        },
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
        },
        
    }
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category