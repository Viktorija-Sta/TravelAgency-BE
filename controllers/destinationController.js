const Destination = require('../models/destinationModel')
const Hotel = require('../models/hotelModel')
const Agency = require('../models/agencyModel')
const Category = require('../models/categoryModel')
const Review = require('../models/reviewModel')

const createDestination = async (req, res) => {
    try {
        const destination = new Destination(req.body)
        await destination.save()
        res.status(201).json(destination)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to create destination', error })
    }
}

const getAllDestinations = async (req, res) => {
    try {
        const filter = {}
        if (req.query.agency) {
            filter.agency = req.query.agency
        }

        if (req.query.category) {
            filter.category = req.query.category  
        }

        const destinations = await Destination.find(filter)
            .populate('agency', 'name location')
            .populate('category', 'name')
        res.json(destinations)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch destinations', error })
    }
}

const getDestinationById = async (req, res) => {
    try {
      const { id } = req.params
  
      const destination = await Destination.findById(id)
        .populate('agency', 'name location contactInfo')
        .populate('category', 'name')
        .populate({
          path: 'hotels',
          model: 'Hotel',
          populate: ['agency', 'category'] 
        })
  
      if (!destination) {
        return res.status(404).json({ message: 'Destination not found' })
      }
  
      const reviews = await Review.find({ destination: id }).populate('user', 'username')
  
      res.json({
        destination,
        hotels: destination.hotels,
        reviews,
      })
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch destination', error })
    }
  }

const updateDestination = async (req, res) => {
    try {
        const { id } = req.params
        const updatedDestination = await Destination.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedDestination) {
            return res.status(404).json({ message: 'Destination not found' })
        }
        res.json(updatedDestination)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update destination', error })
    }
}

const deleteDestination = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Destination.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: 'Destination not found' })
        }
        res.json({ message: 'Destination deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete destination', error })
    }
}

const searchDestinations = async (req, res) => {
    try {
        const { q } = req.query

        if (!q || q.trim() === "") {
            return res.status(400).json({ message: 'Query parameter "q" is required' })
        }

        const regex = new RegExp(q, "i")

        const destinations = await Destination.find({
            $or: [
                { name: regex },
                { description: regex },
                { location: regex }
            ],
        })
            .limit(30)
            .populate("category")

        res.status(200).json(destinations)
    } catch (error) {
        console.error("Search error:", error)
        res.status(500).json({ message: "Server error during search" })
    }
}

const getDestinationsByCategory = async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName

        const category = await Category.findOne({ name: categoryName })

        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        const destinations = await Destination.find({ category: category._id }).populate("category")

        res.json(destinations)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination,
    searchDestinations,
    getDestinationsByCategory
}