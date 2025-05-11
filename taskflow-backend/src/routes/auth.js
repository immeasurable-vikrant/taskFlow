const express = require('express');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const { logError } = require('../utils/logger.js');
const { authenticateToken } = require('../middleware/auth'); // Assuming you have this middleware

const authRouter = express.Router();

// SIGNUP
authRouter.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    
    // Create a token and set cookie
    const token = user.getJWT();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });
    
    // Return user data (without sensitive info)
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    
    res.status(201).json({
      message: 'Signup successful!',
      user: userData,
    });
  } catch (err) {
    logError('SIGNUP - /auth/signup:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// SIGNIN
authRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }
    
    const token = user.getJWT();
    if (!token) {
      return res.status(400).json({ message: 'Invalid token!' });
    }
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });
    
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    
    res.json({
      message: 'Signin successful!',
      user: userData,
    });
  } catch (err) {
    logError('SIGNIN ERROR -', err.message);
    res.status(400).json({ message: err.message });
  }
});

// VERIFY SESSION - Lightweight endpoint to check if token is valid
authRouter.get('/verify', authenticateToken, (req, res) => {
  // If middleware passes, the token is valid
  res.json({ valid: true });
});

// GET CURRENT USER - Only when needed
authRouter.get('/me', authenticateToken, async (req, res) => {
  try {
    // req.userId is set by authenticateToken middleware
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    logError('GET CURRENT USER ERROR -', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGOUT
authRouter.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    logError('LOGOUT ERROR -', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { authRouter };