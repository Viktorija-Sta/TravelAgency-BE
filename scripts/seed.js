require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')
const Hotel = require('../models/hotelModel')
const Destination = require('../models/destinationModel')
const Category = require('../models/categoryModel')
const Agency = require('../models/agencyModel')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await connectDB()

    console.log('⛔ Trinami esami duomenys...')
    await Promise.all([
      User.deleteMany(),
      Hotel.deleteMany(),
      Destination.deleteMany(),
      Category.deleteMany(),
      Agency.deleteMany()
    ])

    console.log('📦 Kuriami vartotojai...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const users = await User.insertMany([
      { username: 'admin', email: 'admin@admin.com', password: hashedPassword, role: 'admin', phoneNumber: '+37060000001',
        address: 'Vilnius' },
      { username: 'john', email: 'john@example.com', password: hashedPassword, role: 'user', phoneNumber: '+37060000003',
        address: 'Vilnius' },
      { username: 'sara', email: 'sara@example.com', password: hashedPassword, role: 'user', phoneNumber: '+37060000002',
        address: 'Vilnius' }
    ])

    console.log('📦 Kuriamos kategorijos...')
    const categories = await Category.insertMany([
      { name: 'Adventure', description: 'Exciting outdoor trips' },
      { name: 'Relaxation', description: 'Peaceful and calm holidays' }
    ])

    console.log('📦 Kuriamos agentūros...')
    const agencies = await Agency.insertMany([
      {
        name: 'TravelPro',
        description: 'Premium travel services',
        location: 'Vilnius',
        contactInfo: { email: 'contact@travelpro.lt', phone: '+37060012345' },
        category: categories[0]._id
      },
      {
        name: 'HolidayWay',
        description: 'Budget-friendly tours',
        location: 'Kaunas',
        contactInfo: { email: 'info@holidayway.lt', phone: '+37061198765' },
        category: categories[1]._id
      }
    ])

    console.log('📦 Kuriamos kelionės (destinations)...')
    const destinations = await Destination.insertMany([
      {
        name: 'Bali',
        description: 'Tropical island',
        fullDescription: 'Beautiful beaches and culture',
        price: 1200,
        location: 'Indonesia',
        imageUrl: 'https://example.com/bali.jpg',
        gallery: ['https://example.com/bali1.jpg', 'https://example.com/bali2.jpg'],
        category: categories[1]._id,
        agency: agencies[1]._id
      },
      {
        name: 'Iceland',
        description: 'Arctic adventure',
        fullDescription: 'Glaciers and volcanoes',
        price: 1900,
        location: 'Iceland',
        imageUrl: 'https://example.com/iceland.jpg',
        gallery: ['https://example.com/iceland1.jpg'],
        category: categories[0]._id,
        agency: agencies[0]._id
      }
    ])

    console.log('📦 Kuriami viešbučiai...')
    await Hotel.insertMany([
      {
        name: 'Ocean View Resort',
        location: 'Bali',
        description: 'Beachfront hotel with pools',
        pricePerNight: 90,
        amenities: ['WiFi', 'Breakfast', 'Pool'],
        category: categories[1]._id,
        agency: agencies[1]._id,
        destination: destinations[0]._id
      },
      {
        name: 'Glacier Inn',
        location: 'Reykjavik',
        description: 'Cozy hotel in Iceland capital',
        pricePerNight: 130,
        amenities: ['WiFi', 'Sauna'],
        category: categories[0]._id,
        agency: agencies[0]._id,
        destination: destinations[1]._id
      }
    ])

    console.log('✅ Duomenys sėkmingai įkelti!')
    process.exit()
  } catch (error) {
    console.error('❌ Klaida seedinant:', error)
    process.exit(1)
  }
}

seedData()
