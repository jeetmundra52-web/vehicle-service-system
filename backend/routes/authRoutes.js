const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error during registration' });
    }
});

/**
 * POST /api/login
 * Real login endpoint using database
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (user && user.password === password) { // Hash check should be here in real apps
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: { id: user._id, email: user.email, name: user.name, role: user.role },
                token: 'mock-jwt-token-' + user._id
            });
        }

        return res.status(401).json({ success: false, error: 'Invalid email or password' });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
