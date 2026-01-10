const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    packageName: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },
    vehicleType: {
        type: String,
        required: [true, 'Vehicle type is required']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    bookingStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    servicesIncluded: {
        type: [String],
        required: true
    },
    validityPeriod: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

module.exports = ServiceBooking;
