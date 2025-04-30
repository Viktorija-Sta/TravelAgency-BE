const mongoose = require('mongoose');
const ROLES = require('../config/roles');

const userSchema = new mongoose.Schema(
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
            default: ROLES.USER,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        profilePicture: {
            type: String,
            default: "../public/profile-picture-default.jpg",
        },
        address: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            zipCode: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[0-9]{10}$/.test(value);
                  },
                  message: (props) => `${props.value} is not a valid phone number`,
            },
        },
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User