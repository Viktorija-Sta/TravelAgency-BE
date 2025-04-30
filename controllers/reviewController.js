const Review = require('../models/reviewModel')
const Destination = require('../models/destinationModel')
const Hotel = require('../models/hotelModel')
const Agency = require('../models/agencyModel')

const createReview = async (req, res) => {
    try {
        const { rating, comment, userId } = req.body
        const { destinationId, hotelId, agencyId } = req.params

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' })
        }

        const existingReview = await Review.findOne({
            userId: req.user._id,
            destinationId,
            hotelId,
            agencyId,
            
        })

        if (existingReview) {
            existingReview.rating = rating
            existingReview.comment = comment || existingReview.comment
            await existingReview.save()
            return res.status(200).json({ message: 'Review updated successfully', review: existingReview })
        }

        const newReview = new Review({
            userId: req.user._id,
            destinationId,
            hotelId,
            agencyId,
            rating,
            comment,
        })
        await newReview.save()

        const allReviews = await Review.find({
            destinationId,
            hotelId,
            agencyId,
        })

        const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length

        if (destinationId) {
            await Destination.findByIdAndUpdate(destinationId, { rating: averageRating })
        } else if (hotelId) {
            await Hotel.findByIdAndUpdate(hotelId, { rating: averageRating })
        } else if (agencyId) {
            await Agency.findByIdAndUpdate(agencyId, { rating: averageRating })
        }

        res.status(201).json({ message: 'Review created successfully', review: newReview })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong', error })
    }
}

const getReviews = async (req, res) => {
    try {
        const { destinationId, hotelId, agencyId } = req.params

        let reviews
        if (destinationId) {
            reviews = await Review.find({ destinationId }).populate('userId', 'username')
        } else if (hotelId) {
            reviews = await Review.find({ hotelId }).populate('userId', 'username')
        } else if (agencyId) {
            reviews = await Review.find({ agencyId }).populate('userId', 'username')
        } else {
            return res.status(400).json({ message: 'Please provide a valid destination, hotel, or agency ID' })
        }

        res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong', error })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }

        await review.deleteOne();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this review' });
        }

        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;

        const updatedReview = await review.save();

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};


module.exports = {
    createReview,
    getReviews,
    deleteReview,
    updateReview,
}