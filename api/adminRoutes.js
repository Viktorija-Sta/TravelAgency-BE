const express = require('express');
const router = express.Router();

const rolesMiddlewares = require("../middlewares/rolesMiddlewares");
const ROLES = require("../config/roles");

const authMiddleware = require('../middlewares/authMiddleware');
const { getStats, getAllOrders, updateOrder } = require('../controllers/adminController');

router.get('/stats', authMiddleware, rolesMiddlewares(ROLES.ADMIN), getStats)
router.put('/orders/:orderId', authMiddleware, rolesMiddlewares(ROLES.ADMIN), updateOrder)
router.get('/orders', authMiddleware, getAllOrders)

module.exports = router