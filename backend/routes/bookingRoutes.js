const express = require('express');
const ServiceBooking = require('../models/ServiceBooking');

const router = express.Router();

/**
 * POST /api/bookService
 * Creates a new service booking
 * 
 * Request Body:
 * - customerName: string (required) - Name of the customer
 * - packageName: string (required) - Name of the selected service package
 * - vehicleType: string (required) - Type of vehicle (Car, Bike, SUV, etc.)
 * - totalPrice: number (optional) - Total package price
 * - servicesIncluded: array (optional) - List of services in the package
 * - validityPeriod: string (optional) - Package validity period
 * 
 * Response:
 * - success: booking created successfully with booking ID
 * - error: validation or database error
 */
router.post('/bookService', async (req, res) => {
    try {
        const {
            customerName,
            packageName,
            vehicleType,
            totalPrice,
            servicesIncluded,
            validityPeriod
        } = req.body;

        // Validate required fields
        if (!customerName || !packageName || !vehicleType) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields. customerName, packageName, and vehicleType are required.'
            });
        }

        // Validate customerName (should not be empty or just whitespace)
        if (typeof customerName !== 'string' || customerName.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Customer name must be a non-empty string.'
            });
        }

        // Validate vehicleType
        const validVehicleTypes = ['Hatchback', 'Sedan', 'SUV', 'Bike', 'Luxury Car', 'Electric Vehicle'];
        if (!validVehicleTypes.includes(vehicleType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid vehicle type. Must be one of: ${validVehicleTypes.join(', ')}`
            });
        }

        // Create new service booking
        const newBooking = new ServiceBooking({
            customerName: customerName.trim(),
            packageName,
            vehicleType,
            totalPrice,
            servicesIncluded,
            validityPeriod,
            bookingStatus: 'Pending',
            bookingDate: new Date()
        });

        // Save to database
        const savedBooking = await newBooking.save();

        // Return success response
        return res.status(201).json({
            success: true,
            message: `Service booking confirmed! Your booking for ${packageName} has been successfully created.`,
            bookingId: savedBooking._id,
            booking: {
                id: savedBooking._id,
                customerName: savedBooking.customerName,
                packageName: savedBooking.packageName,
                vehicleType: savedBooking.vehicleType,
                bookingStatus: savedBooking.bookingStatus,
                bookingDate: savedBooking.bookingDate,
                totalPrice: savedBooking.totalPrice
            }
        });

    } catch (error) {
        console.error('Error creating service booking:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errors
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            error: 'Internal server error. Failed to create booking.',
            message: error.message
        });
    }
});

// GET /api/bookings - Get all bookings (optional endpoint for testing)
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await ServiceBooking.find().sort({ bookingDate: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bookings'
        });
    }
});

// GET /api/booking/:id - Get specific booking (optional endpoint for testing)
router.get('/booking/:id', async (req, res) => {
    try {
        const booking = await ServiceBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch booking'
        });
    }
});

module.exports = router;
