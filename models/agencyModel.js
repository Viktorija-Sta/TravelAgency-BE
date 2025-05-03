const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema(
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
        establishedYear: {
            type: Number,
            required: true,
        },
        website: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        contactInfo: {
            email: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        logo: {
            type: String,
            default: "../public/images.jpg",
        },
    }
)

const Agency = mongoose.model('Agency', agencySchema)
module.exports = Agency