const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
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
        fullDescription: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        gallery: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
    }
)

const Destination = mongoose.model('Destination', destinationSchema)

module.exports = Destination