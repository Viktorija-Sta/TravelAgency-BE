const Agency = require('../models/agencyModel')
const Category = require('../models/categoryModel')
const Destination = require('../models/destinationModel')
const Hotel = require('../models/hotelModel')

/**
 * Sukuria naują kategoriją pagal pateiktus duomenis
 */
const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body)
        await category.save()
        res.send(category)
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * Grąžina visas kategorijas
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.send(categories)
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * Grąžina vieną kategoriją pagal ID
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).send({ error: 'Category Not found' })
        }

        res.send(category)
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * Atnaujina kategorijos duomenis pagal ID
 */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(404).send({ error: 'Category Not found' })
        }

        res.send(updatedCategory)
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * Ištrina kategoriją pagal ID
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        
        const deletedCategory = await Category.findByIdAndDelete(id)

        if (!deletedCategory) {
            return res.status(404).send({ error: 'Category Not found' })
        }
        
        res.send({ message: 'Category was removed', data: deletedCategory })
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * Grąžina visą informaciją apie kategoriją:
 * - pačią kategoriją
 * - su ja susijusius viešbučius, keliones ir agentūras
 */
const getCategoryDetails = async (req, res) => {
    try {
        const { id } = req.params

        const category = await Category.findById(id)
        if (!category) return res.status(404).json({ error: 'Category not found' })

        const hotels = await Hotel.find({ category: id })
        const destinations = await Destination.find({ category: id })
        const agencies = await Agency.find({ category: id })

        res.json({ category, hotels, destinations, agencies })
    } catch (error) {
        res.status(500).json({ error: 'Failed to load category details', message: error })
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory, 
    deleteCategory,
    getCategoryDetails
}
