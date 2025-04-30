const Agency = require('../models/agencyModel')
const Destination = require('../models/destinationModel')
const Hotel = require('../models/hotelModel')
const Category = require('../models/categoryModel')

// CREATE
const createAgency = async (req, res) => {
    try {
        const agency = new Agency(req.body)
        await agency.save()
        res.status(201).json({ message: 'Agency created successfully', data: agency })
    } catch (error) {
        res.status(500).json({ message: 'Failed to create agency', error })
    }
}

// GET ALL
const getAllAgencies = async (req, res) => {
    try {
        const agencies = await Agency.find()
        res.status(200).json(agencies)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch agencies', error })
    }
}

// GET BY ID + RELATIONS
const getAgencyById = async (req, res) => {
    try {
        const { id } = req.params

        const agency = await Agency.findById(id)
        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' })
        }

        const destinations = await Destination.find({ agency: id })
        const hotels = await Hotel.find({ agency: id })
        const categories = await Category.find({ agency: id })

        res.status(200).json({
            agency,
            destinations,
            hotels,
            categories
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch agency details', error })
    }
}

// UPDATE
const updateAgency = async (req, res) => {
    try {
        const { id } = req.params

        const updatedAgency = await Agency.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedAgency) {
            return res.status(404).json({ message: 'Agency not found' })
        }

        res.status(200).json({ message: 'Agency updated successfully', data: updatedAgency })
    } catch (error) {
        res.status(500).json({ message: 'Failed to update agency', error })
    }
}

// DELETE
const deleteAgency = async (req, res) => {
    try {
        const { id } = req.params

        const deletedAgency = await Agency.findByIdAndDelete(id)
        if (!deletedAgency) {
            return res.status(404).json({ message: 'Agency not found' })
        }

        res.status(200).json({ message: 'Agency deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete agency', error })
    }
}

const searchAgencies= async (req, res) => {
    try {
      const { q } = req.query
  
      if (!q || q.trim() === "") {
        return res
          .status(400)
          .json({ message: 'Query parameter "q" is required' })
      }
  
      const regex = new RegExp(q, "i")
  
      const agencies = await Agency.find({
        $or: [{ name: regex }, { description: regex }],
      })
        .limit(30)
        .populate("category")
  
      res.status(200).json(agencies)
    } catch (error) {
      console.error("Search error:", error)
      res.status(500).json({ message: "Server error during search" })
    }
  }

  const getAgenciesByCategory = async (req, res, next) => {
    try {
      const categoryName = req.params.categoryName
  
      const category = await Category.findOne({ name: categoryName })
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }
  
      const agencies = await Agency.find({ category: category._id }).populate(
        "category"
      )
  
      res.json(agencies)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: "Server error" })
    }
  }

module.exports = {
    createAgency,
    getAllAgencies,
    getAgencyById,
    updateAgency,
    deleteAgency,
    searchAgencies,
    getAgenciesByCategory
}
