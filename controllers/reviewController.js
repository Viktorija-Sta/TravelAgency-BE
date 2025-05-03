const Review = require('../models/reviewModel')
const Destination = require('../models/destinationModel')
const Hotel = require('../models/hotelModel')
const Agency = require('../models/agencyModel')

const createReview = async (req, res) => {
    try {
        const { rating, comment, user } = req.body
        const { destination, hotel, agency } = req.params

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' })
        }

        const existingReview = await Review.findOne({
            user: req.user._id,
            destination,
            hotel,
            agency,
            
        })

        if (existingReview) {
            existingReview.rating = rating
            existingReview.comment = comment || existingReview.comment
            await existingReview.save()
            return res.status(200).json({ message: 'Review updated successfully', review: existingReview })
        }

        const newReview = new Review({
            user: req.user._id,
            destination,
            hotel,
            agency,
            rating,
            comment,
        })
        await newReview.save()

        const allReviews = await Review.find({
            destination,
            hotel,
            agency,
        })

        const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length

        if (destination) {
            await Destination.findByIdAndUpdate(destination, { rating: averageRating })
        } else if (hotel) {
            await Hotel.findByIdAndUpdate(hotel, { rating: averageRating })
        } else if (agency) {
            await Agency.findByIdAndUpdate(agency, { rating: averageRating })
        }

        res.status(201).json({ message: 'Review created successfully', review: newReview })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong', error })
    }
}

const getReviews = async (req, res) => {
    try {
      const { destination, hotel, agency } = req.query
  
      let filter = {}
  
      if (destination) filter.destination = destination
      if (hotel) filter.hotel = hotel
      if (agency) filter.agency = agency
  
      const reviews = await Review.find(filter)
        .populate("user", "username")
        .populate("destination", "name") 
        .populate("hotel", "name")
        .populate("agency", "name")
  
      res.status(200).json(reviews)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Something went wrong", error })
    }
  }

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const user = req.user._id
        const userRole = req.user.role

        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        if (review.user.toString() !== user && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review' })
        }

        await review.deleteOne()

        res.status(200).json({ message: 'Review deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong', error })
    }
}

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const { rating, comment } = req.body
        const user = req.user._id
        const userRole = req.user.role

        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        if (review.user.toString() !== user && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this review' })
        }

        review.rating = rating ?? review.rating
        review.comment = comment ?? review.comment

        const updatedReview = await review.save()

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong', error })
    }
}

const getAllReviews = async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate('user', 'username')
        .populate('destination', 'name')
        .populate('hotel', 'name')
        .populate('agency', 'name')
  
      res.status(200).json(reviews)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Nepavyko gauti visų atsiliepimų', error })
    }
  }


module.exports = {
    createReview,
    getReviews,
    deleteReview,
    updateReview,
    getAllReviews,
}