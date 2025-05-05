const { ALLOWED_ORDER_STATUSES } = require("../constants/orderStatus")
const Order = require("../models/orderModel")
const Destination = require("../models/destinationModel")

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
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Only ADMIN can see all orders" });
    }

    const orders = await Order.find()
      .populate("user", "email username")
      .lean();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            let productDetails = null;

            if (item.modelType === "Hotel") {
              productDetails = await Hotel.findById(item.productId).select("name pricePerNight image");
            } else if (item.modelType === "Destination") {
              productDetails = await Destination.findById(item.productId).select("name price imageUrl");
            }

            return {
              ...item,
              details: productDetails,
            };
          })
        );

        return {
          ...order,
          items: enrichedItems,
        };
      })
    );

    res.send(enrichedOrders);
  } catch (error) {
    console.error("Klaida gaunant užsakymus:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status && !ALLOWED_ORDER_STATUSES.includes(status)) {
        return res.status(400).send({ error: "Invalid order status" });
      } 

    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Only ADMIN can update orders" })
    }


    const updatedOrder = await Order.findByIdAndUpdate(
        id,
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
