const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
const ServiceBooking = require('./models/ServiceBooking');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
// Use the shared mongodb container
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/vehicle-service-db';

// Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Booking Service connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
// POST /api/bookService
app.post('/api/bookService', async (req, res) => {
    try {
        const { customerName, packageName, vehicleType, totalPrice, servicesIncluded, validityPeriod } = req.body;

        // Basic validation
        if (!customerName || !packageName || !vehicleType) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const newBooking = await ServiceBooking.create({
            customerName,
            packageName,
            vehicleType,
            totalPrice,
            servicesIncluded,
            validityPeriod
        });

        res.status(201).json({
            success: true,
            message: 'Booking confirmed',
            bookingId: newBooking._id,
            booking: newBooking
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, error: 'Failed to create booking' });
    }
});

// GET /api/bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await ServiceBooking.find().sort({ bookingDate: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
    }
});

app.get('/health', (req, res) => res.json({ status: 'Booking Service OK' }));

app.listen(PORT, () => {
    console.log(`🚀 Booking Service running on port ${PORT}`);
});
