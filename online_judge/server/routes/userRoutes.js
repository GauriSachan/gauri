import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully', token: 'mock-jwt-token' });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
