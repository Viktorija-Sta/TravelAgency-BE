const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const rolesMiddlewares = require('../middlewares/rolesMiddlewares')
const ROLES = require('../config/roles')
const { getAllOrders, updateOrder } = require("../controllers/adminController")
const { getUserOrders, getOrderById, createOrder, deleteOrder } = require("../controllers/orderController")
const { checkout } = require("./users")

router.get('/', authMiddleware, rolesMiddlewares(ROLES.ADMIN), getAllOrders)
router.get('/user/:userId', authMiddleware, rolesMiddlewares(ROLES.ADMIN), getUserOrders)
router.get('/:id', authMiddleware, getOrderById)
router.post('/', authMiddleware, createOrder)
router.put('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), updateOrder)
router.delete('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteOrder)
router.post('/checkout', authMiddleware, checkout)
router.get('/:user', authMiddleware, getUserOrders)

module.exports = router