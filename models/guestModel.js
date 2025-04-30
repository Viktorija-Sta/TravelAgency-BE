const mongoose = require('mongoose');
const ROLES = require('../config/roles');

const guestSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]+$/.test(value)
                },
                message: (props) => `${props.value} is not a valid username`,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                },
                message: (props) => `${props.value} is not a valid email`,
            },
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.GUEST,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        profilePicture: {
            type: String,
            default: "../public/profile-picture-default.jpg",
        },
    }
)

const Guest = mongoose.model('Guest', guestSchema)

module.exports = Guest
