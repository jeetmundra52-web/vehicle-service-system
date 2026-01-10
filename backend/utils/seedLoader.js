const User = require('../models/User');

// This is just a helper function to seed an initial user since we didn't build the Register UI yet
async function seedAdminUser() {
    try {
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123', // In real app, hash this!
                role: 'Admin'
            });
            console.log('✅ Admin user seeded in database');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
}

module.exports = { seedAdminUser };
