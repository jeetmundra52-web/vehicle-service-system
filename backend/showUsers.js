const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-service-db';

async function showUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const users = await User.find({}, { password: 0 }); // Hide passwords for professional display

        if (users.length === 0) {
            console.log('📭 No users found in the database.');
        } else {
            console.log(`\n📋 Registered Users (${users.length}):`);
            console.table(users.map(u => ({
                ID: u._id.toString().substring(0, 8) + '...',
                Name: u.name,
                Email: u.email,
                Role: u.role,
                RegisteredAt: u.createdAt.toLocaleString()
            })));
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        process.exit(1);
    }
}

showUsers();
