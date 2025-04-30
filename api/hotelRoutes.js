const express = require("express");
const { getAllHotels, getHotelsByCategory, getHotelById, createHotel, updateHotel, deleteHotel, searchHotels } = require("../controllers/hotelController");
const authMiddleware = require("../middlewares/authMiddleware");
const rolesMiddlewares = require("../middlewares/rolesMiddlewares");
const ROLES = require("../config/roles");
const router = express.Router();


router.get('/search', searchHotels)
router.get('/', getAllHotels)
router.get('/category/:categoryName', getHotelsByCategory)
router.get('/:id', getHotelById)
router.post('/', authMiddleware, rolesMiddlewares(ROLES.ADMIN), createHotel)
router.put('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), updateHotel)
router.delete('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteHotel)

module.exports = router