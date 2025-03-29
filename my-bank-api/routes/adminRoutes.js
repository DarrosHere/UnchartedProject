const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); 
const Card = require('../models/Cards');
const Transaction = require('../models/Transaction'); 
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


router.post('/update-balance', authMiddleware, async (req, res) => {
    try {
      const { email, balance } = req.body;
  
      if (!email || balance === undefined) {
        return res.status(400).json({ message: 'Email and balance are required' });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.balance = balance;
      await user.save();
  
      res.status(200).json({ message: 'Balance updated successfully', newBalance: user.balance });
    } catch (error) {
      console.error('Error updating balance:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });


router.get('/stats', async (req, res) => {
  try {
    
    const transactionStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    console.log('Raw transactionStats:', transactionStats); 


    const stats = {
      deposits: 0,
      withdrawals: 0,
      transfers: 0,
    };

 
    transactionStats.forEach((stat) => {
      if (stat._id === 'deposit') stats.deposits = stat.totalAmount;
      if (stat._id === 'withdraw') stats.withdrawals = stat.totalAmount; 
      if (stat._id === 'transfer') stats.transfers = stat.totalAmount;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/search-user', authMiddleware, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).populate('cards');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      balance: user.balance,
      cards: user.cards,
    });
  } catch (error) {
    console.error('Error searching for user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create-card-for-user', authMiddleware, async (req, res) => {
  try {
    const { email, cardNumber, expirationDate, cvv } = req.body;

    if (!email || !cardNumber || !expirationDate || !cvv) {
      return res.status(400).json({ message: 'Invalid input. Email, cardNumber, expirationDate, and CVV are required.' });
    }

  
    const parsedDate = new Date(expirationDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid expiration date format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const card = await user.createCard(cardNumber, parsedDate, cvv);

    res.status(201).json({ message: 'Card created successfully', card });
  } catch (error) {
    console.error('Error creating card for user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/transactions-admin', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await user.getTransactionHistory();

  
    const formattedTransactions = transactions.map((tx) => ({
      type: tx.type,
      amount: tx.amount,
      date: tx.date,
      sender: tx.senderId ? { name: tx.senderId.name, email: tx.senderId.email } : null,
      recipient: tx.recipientId ? { name: tx.recipientId.name, email: tx.recipientId.email } : null,
    }));

    res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transaction history for admin:', error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get('/transactions', authMiddleware, async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
   
      const transactions = await Transaction.find({ userId: user._id })
        .populate('senderId', 'name email')
        .populate('recipientId', 'name email')
        .sort({ date: -1 });

      const formattedTransactions = transactions.map((tx) => ({
        type: tx.type,
        amount: tx.amount,
        date: tx.date,
        sender: tx.senderId ? { name: tx.senderId.name, email: tx.senderId.email } : null,
        recipient: tx.recipientId ? { name: tx.recipientId.name, email: tx.recipientId.email } : null,
      }));
  
      res.status(200).json(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions for user:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;