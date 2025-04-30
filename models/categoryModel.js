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
        destinations: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Destination' 
            }
        ],
        hotels: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Hotel' 
            }
        ],
        agencies: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Agency' 
            }
        ]

    }
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category