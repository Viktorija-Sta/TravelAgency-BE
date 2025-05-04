const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const rolesMiddlewares = require('../middlewares/rolesMiddlewares')
const ROLES = require('../config/roles')
const { getAllOrders, updateOrder } = require("../controllers/adminController")
const { getUserOrders, getOrderById, createOrder, deleteOrder } = require("../controllers/orderController")
const { checkout } = require("./users")
const { getMyOrders } = require("../controllers/userController")

router.post('/', authMiddleware, createOrder)
router.get('/my-orders', authMiddleware, getMyOrders)
router.get('/user/:userId', authMiddleware, rolesMiddlewares(ROLES.ADMIN), getUserOrders)
router.get('/:id', authMiddleware, getOrderById)
router.get('/:user', authMiddleware, getUserOrders)

module.exports = router