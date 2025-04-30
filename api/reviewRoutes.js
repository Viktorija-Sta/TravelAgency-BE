const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createReview } = require('../controllers/reviewController')
const router = express.Router()
const rolesMiddleware = require('../middlewares/rolesMiddleware')
const ROLES = require('../config/roles')

router.post('/:id/reviews', authMiddleware, createReview)
router.get('/:id/reviews', authMiddleware, getReviews)
router.delete('/:id/reviews', authMiddleware, deleteReview)
router.put('/:id/reviews', authMiddleware, updateReview)

module.exports = router