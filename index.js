const express = require("express");
const path = require("path");
const process = require("process");
require("dotenv").config();
const mongoose = require("mongoose");
const globalErrorHandler = require("./controllers/errorController");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// CORS nustatymai
const allowedOrigins = [
  "https://atsiskaitymas-fe-3tpy.vercel.app",
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some((allowedOrigin) => origin.match(allowedOrigin))) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow access from this origin"));
    }
  },
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Duomenų bazės prisijungimas
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");

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
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });
