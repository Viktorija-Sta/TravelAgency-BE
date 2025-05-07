const mongoose = require('mongoose')
const ROLES = require('../config/roles')

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
            default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg" ,
        },
        address: {
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            postalCode: {
                type: String,
            },
            country: {
                type: String,
            },
        },
        phoneNumber: {
            type: String,
            trim: true,
            default: null,
            validate: {
              validator: function (value) {
                return !value || /^\+?\d{9,15}$/.test(value);
              },
              message: (props) => `${props.value} is not a valid phone number`,
            },
          },
        orders: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Order",
            },
          ],
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User