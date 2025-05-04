const Agency = require('../models/agencyModel');
const Category = require('../models/categoryModel');
const Destination = require('../models/destinationModel');
const Hotel = require('../models/hotelModel');
const Review = require('../models/reviewModel');

// CREATE
const createHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body)
        await hotel.save()
        res.status(201).json(hotel)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to create hotel', error })
    }
}

// GET ALL HOTELS
const getAllHotels = async (req, res) => {
    try {
      const filter = {}
  
      if (req.query.agency) {
        filter.agency = req.query.agency
    }

    if (req.query.category) {
        filter.category = req.query.category  
    }

    if (req.query.destination) {
      filter.destination = req.query.destination 
    }
  
      const hotels = await Hotel.find(filter)
        .populate('destination', 'name location')
        .populate('category', 'name')
        .populate('agency', 'name')
  
      res.json(hotels)
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch hotels', error })
    }
  }

// GET SINGLE HOTEL
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params

        const hotel = await Hotel.findById(id)

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' })
        }

        const destinations = await Destination.find({ hotel: id })
        const categories = await Category.find({ hotel: id })
        const agencies = await Agency.find({ hotel: id })
        const reviews = await Review.find({ hotel: id }).populate('user', 'username')
           

        res.json({ hotel, categories, destinations, agencies, reviews })
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch hotel', error })
    }
}

// UPDATE HOTEL
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params
        const updatedHotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true })
            .populate('destination', 'name location')
            .populate('category', 'name')
            .populate('agency', 'name')
        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' })
        }
        res.json(updatedHotel)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update hotel', error })
    }
};

// DELETE HOTEL
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHotel = await Hotel.findByIdAndDelete(id)
        if (!deletedHotel) {
            return res.status(404).json({ message: 'Hotel not found' })
        }
        res.json({ message: 'Hotel deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete hotel', error })
    }
}

const searchHotels= async (req, res) => {
    try {
      const { q } = req.query;
  
      if (!q || q.trim() === "") {
        return res
          .status(400)
          .json({ message: 'Query parameter "q" is required' })
      }
  
      const regex = new RegExp(q, "i")
  
      const hotels = await Hotel.find({
        $or: [
            { name: regex }, 
            { description: regex }, 
            { location: regex }
        ],
      })
        .limit(30)
        .populate("category")
  
      res.status(200).json(hotels)
    } catch (error) {
      console.error("Search error:", error)
      res.status(500).json({ message: "Server error during search" })
    }
  }

  const getHotelsByCategory = async (req, res, next) => {
    try {
      const categoryName = req.params.categoryName
  
      const category = await Category.findOne({ name: categoryName })
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }
  
      const hotels = await Hotel.find({ category: category._id }).populate(
        "category"
      )
  
      res.json(hotels)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: "Server error" })
    }
  }

module.exports = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    searchHotels,
    getHotelsByCategory
}
