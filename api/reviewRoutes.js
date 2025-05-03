const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createReview, updateReview, deleteReview, getReviews, getAllReviews } = require('../controllers/reviewController')
const router = express.Router()

router.get('/', getAllReviews)
router.post('/:id/reviews', authMiddleware, createReview)
router.get('/:id/reviews', authMiddleware, getReviews)
router.delete('/:id/reviews', authMiddleware, deleteReview)
router.put('/:id/reviews', authMiddleware, updateReview)

module.exports = router