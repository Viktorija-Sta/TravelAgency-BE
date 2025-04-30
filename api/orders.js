const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const rolesMiddleware = require('../middlewares/rolesMiddleware')
const ROLES = require('../config/roles')
const { getAllOrders, updateOrderStatus } = require("../controllers/adminController")
const { getUserOrders, getOrderById, createOrder, deleteOrder } = require("../controllers/orderController")
const { checkout } = require("./users")

router,get('/', authMiddleware, rolesMiddleware(ROLES.ADMIN), getAllOrders)
router.get('/user/:userId', authMiddleware, rolesMiddleware(ROLES.ADMIN), getUserOrders)
router.get('/:id', authMiddleware, getOrderById)
router.post('/', authMiddleware, createOrder)
router.put('/:id', authMiddleware, rolesMiddleware(ROLES.ADMIN), updateOrderStatus)
router.delete('/:id', authMiddleware, rolesMiddleware(ROLES.ADMIN), deleteOrder)
router.post('/checkout', authMiddleware, checkout)
router.get('/:user', authMiddleware, getUserOrders)

module.exports = router