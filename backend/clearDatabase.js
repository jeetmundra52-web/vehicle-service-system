const mongoose = require('mongoose');
const ServiceBooking = require('./models/ServiceBooking');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-service-db';

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        // Delete all bookings
        const result = await ServiceBooking.deleteMany({});

        console.log(`🗑️  Deleted ${result.deletedCount} booking(s) from the database`);
        console.log('✅ Database cleared successfully');

        // Close connection
        await mongoose.connection.close();
        console.log('👋 Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();
