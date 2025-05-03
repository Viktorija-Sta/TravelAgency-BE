const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const ROLES = require("../config/roles");
const { register, login, getUsers, deleteUser, getCurrentUser, updateUser } = require('../controllers/userController');
const { getMyOrders } = require('../controllers/orderController');
const rolesMiddlewares = require('../middlewares/rolesMiddlewares');


router.post("/register", register);
router.post("/login", login);
router.get('/me', authMiddleware, getCurrentUser)
router.get("/", authMiddleware, rolesMiddlewares(ROLES.ADMIN), getUsers);
router.delete("/:id", authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteUser);
router.get("/orders", authMiddleware, getMyOrders);
router.put("/:id", authMiddleware, updateUser)

module.exports = router;