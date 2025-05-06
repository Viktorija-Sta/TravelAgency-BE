const { ALLOWED_ORDER_STATUSES } = require("../constants/orderStatus")
const Order = require("../models/orderModel")
const Destination = require("../models/destinationModel")

//Gauna bendrą statistiką: visų užsakymų skaičių ir bendras pajamas
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

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalAmount : 0

    res.status(200).json({
      totalOrders,  
      totalRevenue,    
    })
  } catch (error) {
    res.status(500).json({ message: "Server error during stats retrieval", error })
  }
}

//Grąžina visus užsakymus (tik adminui), papildomai su duomenimis apie produktus
const getAllOrders = async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Only ADMIN can see all orders" })
    }

    // Gaunam visus užsakymus su vartotojo info
    const orders = await Order.find()
      .populate("user", "email username")
      .lean()

    // Enrishinam kiekvieno užsakymo prekes su produktais
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            let productDetails = null

            // Priklausomai nuo modelType – pasiimam atitinkamus duomenis
            if (item.modelType === "Hotel") {
              productDetails = await Hotel.findById(item.productId).select("name pricePerNight image")
            } else if (item.modelType === "Destination") {
              productDetails = await Destination.findById(item.productId).select("name price imageUrl")
            }

            return {
              ...item,
              details: productDetails,
            }
          })
        )

        return {
          ...order,
          items: enrichedItems,
        }
      })
    )

    res.send(enrichedOrders)
  } catch (error) {
    console.error("Klaida gaunant užsakymus:", error)
    res.status(500).send({ message: "Server error", error })
  }
}

// Atnaujina užsakymo statusą (tik adminams)
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    // Patikrinam ar statusas leidžiamas
    if (status && !ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).send({ error: "Invalid order status" })
    }

    // Tik adminai gali keisti užsakymų statusą
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Only ADMIN can update orders" })
    }

    // Atnaujinam statusą
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
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
