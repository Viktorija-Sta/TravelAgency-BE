const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware')
const rolesMiddleware = require('../middlewares/rolesMiddleware')
const ROLES = require('../config/roles')
const { register, login, getUser, deleteUser, getMyOrders } = require('../controllers/userController');

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/', authMiddleware, rolesMiddleware(ROLES.ADMIN), getUser)
router.delete('/:id', authMiddleware, rolesMiddleware(ROLES.ADMIN), deleteUser)
router.get('/orders', authMiddleware, getMyOrders)

module.exports = router