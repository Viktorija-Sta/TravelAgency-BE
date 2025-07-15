const express = require("express")
const path = require("path")
const process = require("process")
require("dotenv").config()
require("./db")
const globalErrorHandler = require("./controllers/errorController")

const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

app.use(bodyParser.urlencoded({ extended: true}))
app.use(cors())
app.use(express.json())

const userAPIRoutes = require('./api/users')
const categoryAPIRoutes = require('./api/categoryRoutes')
const adminAPIRoutes = require('./api/adminRoutes')
const agencyAPIRoutes = require('./api/agencyRoutes')
const destinationAPIRoutes = require('./api/destinationRoutes')
const hotelAPIRoutes = require('./api/hotelRoutes')
const orderAPIRoutes = require('./api/orders')
const reviewAPIRoutes = require('./api/reviewRoutes')


app.use('/api/users', userAPIRoutes)
app.use('/api/categories', categoryAPIRoutes)
app.use('/api/admin', adminAPIRoutes)
app.use('/api/agencies', agencyAPIRoutes)
app.use('/api/destinations', destinationAPIRoutes)
app.use('/api/hotels', hotelAPIRoutes)
app.use('/api/reviews', reviewAPIRoutes)
app.use('/api/orders', orderAPIRoutes)



app.use(globalErrorHandler)

app.get('/', (req, res) => {
    res.render('index')
})

const PORT = process.env.PORT || 2001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
