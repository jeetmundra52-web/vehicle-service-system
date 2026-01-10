const mongoose = require('mongoose');

/**
 * MongoDB Schema for Service Bookings
 * 
 * This schema stores all information related to vehicle service bookings
 * including customer details, package information, and booking status.
 */
const serviceBookingSchema = new mongoose.Schema({
    // Customer name - required field
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [2, 'Customer name must be at least 2 characters long'],
        maxlength: [100, 'Customer name cannot exceed 100 characters']
    },

    // Selected service package name - required field
    packageName: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },

    // Type of vehicle - required field
    vehicleType: {
        type: String,
        required: [true, 'Vehicle type is required'],
        enum: {
            values: ['Hatchback', 'Sedan', 'SUV', 'Bike', 'Luxury Car', 'Electric Vehicle'],
            message: '{VALUE} is not a valid vehicle type'
        }
    },

    // Date when the booking was made
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    },

    // Current status of the booking
    bookingStatus: {
        type: String,
        enum: {
            values: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
            message: '{VALUE} is not a valid booking status'
        },
        default: 'Pending'
    },

    // Scheduled date for the service (optional - can be set later)
    serviceDate: {
        type: Date,
        validate: {
            validator: function (value) {
                // Service date should be in the future or today
                return !value || value >= new Date().setHours(0, 0, 0, 0);
            },
            message: 'Service date cannot be in the past'
        }
    },

    // Total price of the package
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Price cannot be negative']
    },

    // Array of services included in the package
    servicesIncluded: {
        type: [String],
        required: true,
        validate: {
            validator: function (services) {
                return services && services.length > 0;
            },
            message: 'At least one service must be included in the package'
        }
    },

    // Validity period of the package
    validityPeriod: {
        type: String,
        required: [true, 'Validity period is required']
    },

    // Additional notes or special requirements (optional)
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },

    // Contact information (optional)
    contactNumber: {
        type: String,
        validate: {
            validator: function (v) {
                // If provided, should be a valid phone number format
                return !v || /^\d{10}$/.test(v);
            },
            message: 'Please provide a valid 10-digit phone number'
        }
    },

    // Email address (optional)
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                // If provided, should be a valid email format
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    }
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

// Create indexes for faster queries
serviceBookingSchema.index({ customerName: 1 });
serviceBookingSchema.index({ bookingDate: -1 });
serviceBookingSchema.index({ bookingStatus: 1 });
serviceBookingSchema.index({ vehicleType: 1 });

// Pre-save hook to set default service date if not provided
serviceBookingSchema.pre('save', function (next) {
    if (!this.serviceDate && this.isNew) {
        // Set service date to 3 days from booking date by default
        this.serviceDate = new Date(this.bookingDate);
        this.serviceDate.setDate(this.serviceDate.getDate() + 3);
    }
    next();
});

// Instance method to check if booking is expired
serviceBookingSchema.methods.isExpired = function () {
    if (!this.serviceDate) return false;
    return this.serviceDate < new Date() && this.bookingStatus === 'Pending';
};

// Instance method to format booking details
serviceBookingSchema.methods.getFormattedDetails = function () {
    return {
        bookingId: this._id,
        customer: this.customerName,
        package: this.packageName,
        vehicle: this.vehicleType,
        status: this.bookingStatus,
        bookedOn: this.bookingDate.toLocaleDateString(),
        scheduledFor: this.serviceDate ? this.serviceDate.toLocaleDateString() : 'Not scheduled',
        price: `₹${this.totalPrice}`,
        validity: this.validityPeriod
    };
};

// Static method to find bookings by status
serviceBookingSchema.statics.findByStatus = function (status) {
    return this.find({ bookingStatus: status }).sort({ bookingDate: -1 });
};

// Static method to find recent bookings
serviceBookingSchema.statics.findRecent = function (limit = 10) {
    return this.find().sort({ bookingDate: -1 }).limit(limit);
};

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

module.exports = ServiceBooking;
