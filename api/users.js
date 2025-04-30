const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const ROLES = require('../config/roles')
const { register, login, getUser, deleteUser, getMyOrders } = require('../controllers/userController');
const rolesMiddlewares = require('../middlewares/rolesMiddlewares');

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/', authMiddleware, rolesMiddlewares(ROLES.ADMIN), getUser)
router.delete('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteUser)
router.get('/orders', authMiddleware, getMyOrders)

module.exports = router