const express = require("express");
const cors = require("cors");
const process = require("process");
require("dotenv").config();
const mongoose = require("mongoose");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// CORS nustatymai: leidžiame visus Vercel subdomenus
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || /vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow access from this origin"));
    }
  },
  credentials: true
}));

app.use(express.json());

// API maršrutai
const userAPIRoutes = require('./api/users');
const categoryAPIRoutes = require('./api/categoryRoutes');
const adminAPIRoutes = require('./api/adminRoutes');
const agencyAPIRoutes = require('./api/agencyRoutes');
const destinationAPIRoutes = require('./api/destinationRoutes');
const hotelAPIRoutes = require('./api/hotelRoutes');
const orderAPIRoutes = require('./api/orders');
const reviewAPIRoutes = require('./api/reviewRoutes');

app.use('/api/users', userAPIRoutes);
app.use('/api/categories', categoryAPIRoutes);
app.use('/api/admin', adminAPIRoutes);
app.use('/api/agencies', agencyAPIRoutes);
app.use('/api/destinations', destinationAPIRoutes);
app.use('/api/hotels', hotelAPIRoutes);
app.use('/api/reviews', reviewAPIRoutes);
app.use('/api/orders', orderAPIRoutes);

app.use(globalErrorHandler);

// Pagrindinis maršrutas
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Serverio paleidimas
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
