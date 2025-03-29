const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || '', 
      balance: 0,
      lastLogin: new Date(),
    });
    await newUser.save();

    const token = jwt.sign(
      { 
        name: newUser.name || '',
        email: newUser.email,
        balance: newUser.balance,
        lastLogin: newUser.lastLogin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });

    if (!name) {
      return res.status(201).json({
        message: 'Registration successful, please set your name',
        requiresName: true,
        token, 
      });
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request received:', { email, password });

    if (!email || !password) {
      console.error('Validation failed: Email or password missing');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log('User found:', user);

    console.log('Plain-text password received:', password);
    console.log('Hashed password from DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    console.log('Password matched successfully');

    user.lastLogin = new Date();
    await user.save();
    console.log('Last login updated for user:', email);

    const token = jwt.sign(
      {
        name: user.name || '',
        email: user.email,
        balance: user.balance,
        lastLogin: user.lastLogin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token generated successfully');

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If the email exists, a reset link will be generated.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    user.resetToken = hashedToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(`Password reset link for user ${user.email}: ${resetUrl}`);

    res.status(200).json({ message: 'If the email exists, a reset link will be generated.' });
  } catch (error) {
    console.error('Error in /request-reset:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Error in /reset-password/:token:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in /reset-password/:token:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;