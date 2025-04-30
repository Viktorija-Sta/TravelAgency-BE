const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createReview, updateReview, deleteReview, getReviews } = require('../controllers/reviewController')
const router = express.Router()


router.post('/:id/reviews', authMiddleware, createReview)
router.get('/:id/reviews', authMiddleware, getReviews)
router.delete('/:id/reviews', authMiddleware, deleteReview)
router.put('/:id/reviews', authMiddleware, updateReview)

module.exports = router