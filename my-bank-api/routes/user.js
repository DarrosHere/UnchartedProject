const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); 
const Card = require('../models/Cards');
const Transaction = require('../models/Transaction'); 
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const locks = new Map(); 



router.get('/user', authMiddleware, async (req, res) => {
  try {
    console.log('Authenticated user:', req.user); // Debug log
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      balance: user.balance,
      lastLogin: user.lastLogin,
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Clear the authentication token (if using cookies)
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/set-name', authMiddleware, async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name.trim(); // Update the user's name
    await user.save();

    res.status(200).json({ message: 'Name updated successfully', name: user.name });
  } catch (error) {
    console.error('Error updating name:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;