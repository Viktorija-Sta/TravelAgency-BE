const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const rolesMiddlewares = require('../middlewares/rolesMiddlewares')
const ROLES = require('../config/roles')
const { getUserOrders, getOrderById, createOrder } = require("../controllers/orderController")
const { getMyOrders } = require("../controllers/userController")

router.post('/', authMiddleware, createOrder)
router.get('/my-orders', authMiddleware, getMyOrders)
router.get('/user/:userId', authMiddleware, rolesMiddlewares(ROLES.ADMIN), getUserOrders)
router.get('/:id', authMiddleware, getOrderById)
router.get('/:user', authMiddleware, getUserOrders)

module.exports = router