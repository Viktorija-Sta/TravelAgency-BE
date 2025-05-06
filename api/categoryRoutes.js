const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getCategoryDetails } = require('../controllers/categoryController')
const router = express.Router()
const rolesMiddlewares = require('../middlewares/rolesMiddlewares')
const ROLES = require('../config/roles')


router.get("/", authMiddleware, getCategories)
router.get("/:id", authMiddleware, getCategoryById)
router.get(':id.details', authMiddleware, getCategoryDetails)

router.post("/", authMiddleware, rolesMiddlewares(ROLES.ADMIN), createCategory)
router.put("/:id", authMiddleware, rolesMiddlewares(ROLES.ADMIN), updateCategory)
router.delete("/:id", authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteCategory)

module.exports = router