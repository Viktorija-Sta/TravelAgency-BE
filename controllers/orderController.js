const Order = require('../models/orderModel')
const User = require('../models/userModel')
const { ALLOWED_ORDER_STATUSES } = require("../constants/orderStatus")


const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: "Access denied. Please login" })
        }

        const userId = req.user._id
        const { items, totalAmount, shippingAddress } = req.body

        if (!items || !shippingAddress || !totalAmount) {
            return res.status(400).send({ message: "Missing required fields" })
        }

        const newOrder = new Order({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
        })

        await newOrder.save()
        res.send(newOrder)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong with order", err })
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const user = req.user._id
        const userRole = req.user.role

        const order = await Order.findById(id)
            .populate('user', 'username email')
            .populate('destination', 'name location')
            .populate('hotel', 'name location')

        if (!order) {
            return res.status(404).send({ message: "Order not found" })
        }

        if (order.user.toString() !== user.toString() && userRole !== 'admin') {
            return res.status(403).send({ message: "Access denied" })
        }

        res.send(order)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}


const getUserOrders = async (req, res) => {
    const { user } = req.params
    try {
        if (req.user.role !== "admin" && req.user._id.toString() !== user) {
            return res.status(403).send({ message: "Access denied" })
        }
        const orders = await Order.find({ user })
            .populate('user', 'username email')
            .populate('destination', 'name location')
            .populate('hotel', 'name location')

        
        if (!orders) {
            return res.status(404).send({ message: "No orders found" })
        }

        res.send(orders)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}

const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).send({ message: "Access denied" })
        }

        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('destination', 'name location')
            .populate('hotel', 'name location')

        if (!orders) {
            return res.status(404).send({ message: "No orders found" })
        }

        res.send(orders)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).send({ message: "Access denied" })
        }

        const { id } = req.params
        const { status } = req.body

        if (!ALLOWED_ORDER_STATUSES.includes(status)) {
            return res.status(400).send({ message: "Invalid order status" })
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        if (!updatedOrder) {
            return res.status(404).send({ message: "Order not found" })
        }

        res.send(updatedOrder)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}
const deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).send({ message: "Access denied" })
        }

        const { id } = req.params
        const deletedOrder = await Order.findByIdAndDelete(id)

        if (!deletedOrder) {
            return res.status(404).send({ message: "Order not found" })
        }

        res.send({ message: "Order deleted successfully" })
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id

        const orders = await Order.find({ user: userId })
            .populate('user', 'username email')
            .populate('destination', 'name location')
            .populate('hotel', 'name location')

        if (!orders) {
            return res.status(404).send({ message: "No orders found" })
        }

        res.send(orders)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}
const getUserOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const order = await Order.findOne({ _id: id, user: userId })
            .populate('user', 'username email')
            .populate('destination', 'name location')
            .populate('hotel', 'name location')

        if (!order) {
            return res.status(404).send({ message: "Order not found" })
        }

        res.send(order)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}

const checkout = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body

        if (!items || !shippingAddress || !totalAmount) {
            return res.status(400).send({ message: "Missing required fields" })
        }

        let calculatedTotal = 0
        items.forEach((item) => {
            calculatedTotal += item.price * item.quantity;
        })
        

        if (totalAmount && calculatedTotal !== totalAmount) {
            return res.status(400).json({ error: "Total amount mismatch" })
        }


        const newOrder = new Order({
            user: req.user._id,
            items,
            totalAmount: totalAmount || calculatedTotal ,
            shippingAddress,
            orderDate: new Date(),
            status: "pending"
        })

        await newOrder.save()
        res.send(newOrder)
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", err })
    }
}

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getMyOrders,
    getUserOrderById,
    checkout
}