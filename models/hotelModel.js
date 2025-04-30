const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },
        amenities: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },
        destinationId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Destination' 
        },
        categoryId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category' 
        },
        agencyId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Agency' 
        }
    },
    {timestamp: true},
)

const Hotel = mongoose.model('Hotel', hotelSchema)

module.exports = Hotel