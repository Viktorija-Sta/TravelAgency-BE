const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const process = require("process");
const Order = require("../models/orderModel");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send({ message: "Email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error)
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({ message: "User Successfully Logged In", token });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (id === currentUserId) {
      return res.status(403).send({ error: "You cannot delete yourself" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send({ message: "User was deleted", data: deletedUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.productId", "title price image");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error while retrieving user orders:", error);
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};

const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password")
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error })
    }
  }

  const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { username, email, phoneNumber, address } = req.body

        const updateData = { username, email, phoneNumber, address }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password')

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" })
        }

        res.send({ message: "User updated successfully", data: updatedUser })
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = {
    register,
    login,
    getUsers,
    deleteUser,
    getMyOrders,
    getCurrentUser,
    updateUser
};
