const Order = require("../models/orderModel")

const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ])

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalAmount : 0

    res.status(200).json({
      totalOrders,
      totalRevenue,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during stats retrieval", error })
  }
}

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).send({ message: "Only ADMIN can see all orders" })
    }

    const orders = await Order.find()
    .populate('user', 'email username')
    .populate('items.destination', 'name price imageUrl')
    .populate('items.hotel', 'name price imageUrl') 

    res.send(orders)
  } catch (error) {
    console.error('Klaida gaunant užsakymus:', error)
    res.status(500).send(error)
  }
}
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status && !ALLOWED_ORDER_STATUSES.includes(status)) {
        return res.status(400).send({ error: "Invalid order status" });
      } 

    if (req.user.role !== "ADMIN") {
      return res.status(403).send({ message: "Only ADMIN can update orders" })
    }


    const updatedOrder = await Order.findByIdAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
    )

    if (!updatedOrder) {
      return res.status(404).send({ message: "Order not found" })
    }

    res.status(200).send(updatedOrder)
  } catch (error) {
    console.error('Klaida atnaujinant užsakymo statusą:', error)
    res.status(500).send({ message: "Server error updating order status" })
  }
}


module.exports = {
  getStats,
  getAllOrders,
  updateOrder,
}
