const express = require('express');
const router = express.Router();

const rolesMiddleware = require("../middlewares/rolesMiddleware");
const ROLES = require("../config/roles");

const authMiddleware = require('../middlewares/authMiddleware');
const { getStats, getAllOrders } = require('../controllers/adminController');
const { updateOrderStatus } = require('../controllers/orderController');

router.get('stats', authMiddleware, rolesMiddleware(ROLES.ADMIN), getStats)
router.put('/orders/:orderId', authMiddleware, rolesMiddleware(ROLES.ADMIN), updateOrderStatus)
router.get('/orders', authMiddleware, getAllOrders)

module.exports = router