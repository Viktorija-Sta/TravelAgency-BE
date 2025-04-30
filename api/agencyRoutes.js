const express = require("express")
const { searchAgencies, getAllAgencies, getAgenciesByCategory, getAgencyById, createAgency, updateAgency, deleteAgency } = require("../controllers/agencyController")
const authMiddleware = require("../middlewares/authMiddleware")
const ROLES = require("../config/roles")
const rolesMiddlewares = require("../middlewares/rolesMiddlewares")

const router = express.Router()



router.get('/search', searchAgencies)
router.get('/', getAllAgencies)
router.get('/category/:categoryName', getAgenciesByCategory)
router.get('/:id', getAgencyById)
router.post('/', authMiddleware, rolesMiddlewares(ROLES.ADMIN), createAgency)
router.put('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), updateAgency)
router.delete('/:id', authMiddleware, rolesMiddlewares(ROLES.ADMIN), deleteAgency)


module.exports = router