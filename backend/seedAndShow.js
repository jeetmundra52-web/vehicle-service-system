const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-service-db';

async function seedAndShow() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Ensure admin user exists
        const adminEmail = 'admin@example.com';
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'admin123',
                role: 'Admin'
            });
            console.log('✨ Seeded new Admin user');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        const users = await User.find({}, { password: 0 });

        console.log(`\n📋 Registered Users in Database (${users.length}):`);
        console.table(users.map(u => ({
            ID: u._id.toString().substring(0, 8) + '...',
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Created: u.createdAt.toLocaleString()
        })));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedAndShow();
