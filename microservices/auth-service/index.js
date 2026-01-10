const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
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
    .then(() => {
        console.log('✅ Auth Service connected to MongoDB');
        seedAdminUser();
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Seeding Admin User
async function seedAdminUser() {
    try {
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'Admin'
            });
            console.log('✨ Admin user seeded');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
}

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, error: 'All fields required' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, error: 'User already exists' });

        const newUser = await User.create({ name, email, password });
        res.status(201).json({ success: true, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'All fields required' });

        const user = await User.findOne({ email });
        if (user && user.password === password) {
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: { id: user._id, email: user.email, name: user.name, role: user.role },
                token: 'mock-jwt-token-' + user._id
            });
        }
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.get('/health', (req, res) => res.json({ status: 'Auth Service OK' }));

app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on port ${PORT}`);
});
