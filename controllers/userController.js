const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const process = require("process");
const Order = require("../models/orderModel");

const register = async (req, res) => {
    const { username, email, password, phoneNumber, address } = req.body

    if (!username || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required" })
    }

   
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
        })

        await newUser.save()

        const token = jwt.sign(
            {
                username: newUser.username,
                email: newUser.email,
                id: newUser._id,
                address: newUser.address,
                phoneNumber: newUser.phoneNumber,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.send ({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                address: newUser.address,
            },
        })
    } catch (err) {
        res.status(500).send(err)
    }
}     


const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({ message: "Invalid email or password" })
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).send({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).send({ message: "Invalid email or password" })
        }

        const token = jwt.sign(
            {
                username: user.username,
                email: user.email,
                id: user._id,
                address: user.address,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.send({
            message: "User logged in successfully",
            token,
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

const getUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied' })
        }

        const users = await User.find().select('-password')
        res.send(users)
    } catch (err) {
        res.status(500).send(err)
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params 
        const currentUserId = req.user.id

        if(id === currentUserId) {
            return res.status(400).send({ message: "You cannot delete yourself" })
        }

        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" })
        }

        res.send({ message: "User deleted successfully", data: deletedUser })
    } catch (err) {
        res.status(500).send(err)
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { username, email, password, phoneNumber, address } = req.body

        const updateData = { username, email, phoneNumber, address }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" })
        }

        res.send({ message: "User updated successfully", data: updatedUser })
    } catch (err) {
        res.status(500).send(err)
    }
}


const getMyOrders = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const orders = await Order.find({ user: userId })
        .populate("items.destinationId", "title price image");
  
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error while retrieving user orders:", error);
      res.status(500).json({ message: "Failed to retrieve orders", error });
    }
  };

module.exports = {
    register,
    login,
    getUser,
    deleteUser,
    updateUser,
    getMyOrders,
}