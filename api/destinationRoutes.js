const express = require("express")
const { searchDestinations, getAllDestinations, getDestinationsByCategory, getDestinationById, createDestination, updateDestination, deleteDestination } = require("../controllers/destinationController")
const authMiddleware = require("../middlewares/authMiddleware")
const ROLES = require('../config/roles')
const rolesMiddlewares = require("../middlewares/rolesMiddlewares")
const router = express.Router()



router.get('/search', searchDestinations)
router.get('/', getAllDestinations)
router.get('/category/:categoryName', getDestinationsByCategory)
router.get('/:id', getDestinationById)
router.post('/', authMiddleware, rolesMiddlewares(ROLES.ADMIN) , createDestination)
router.put('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), updateDestination)
router.delete('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteDestination)


module.exports = router