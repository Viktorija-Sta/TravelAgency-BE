const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router()
const rolesMiddleware = require('../middlewares/rolesMiddleware')
const ROLES = require('../config/roles')


router.get("/", authMiddleware, getCategories)
router.get("/:id", authMiddleware, rolesMiddleware(ROLES.ADMIN), getCategoryById)
router.post("/", authMiddleware, rolesMiddleware(ROLES.ADMIN), createCategory)
router.put("/:id", authMiddleware, rolesMiddleware(ROLES.ADMIN), updateCategory)
router.delete("/:id", authMiddleware, rolesMiddleware(ROLES.ADMIN), deleteCategory)

module.exports = router