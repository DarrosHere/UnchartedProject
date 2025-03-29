const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();
const locks = new Map();


router.post('/withdraw', authMiddleware, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const amount = req.body.amount;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }
  
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      
      user.balance -= amount;
      await user.save();
  
   
      await Transaction.createWithdrawal(user, amount);
  
      res.status(200).json({ message: 'Withdrawal successful', balance: user.balance });
    } catch (error) {
      console.error('Error during withdrawal:', error.message);
      res.status(400).json({ message: error.message });
    }
  });

  router.post('/transfer', authMiddleware, async (req, res) => {
    const { recipientId, amount } = req.body;
    const senderEmail = req.user.email;
  
    if (locks.has(senderEmail)) {
      console.log(`[DEBUG] Transfer lock active for sender: ${senderEmail}`);
      return res.status(429).json({ message: 'Transfer already in progress. Please wait.' });
    }
  
    locks.set(senderEmail, true);
    console.log(`[DEBUG] Transfer lock acquired for sender: ${senderEmail}`);
  
    try {
      console.log(`[DEBUG] Transfer request received: sender=${senderEmail}, recipient=${recipientId}, amount=${amount}`);
  
      const sender = await User.findOne({ email: senderEmail });
      if (!sender) {
        console.error(`[ERROR] Sender not found: ${senderEmail}`);
        return res.status(404).json({ message: 'Sender not found' });
      }
  
      const recipient = await User.findOne({ email: recipientId });
      if (!recipient) {
        console.error(`[ERROR] Recipient not found: ${recipientId}`);
        return res.status(404).json({ message: 'Recipient not found' });
      }
  
      if (sender.balance < amount) {
        console.error(`[ERROR] Insufficient balance: senderBalance=${sender.balance}, amount=${amount}`);
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      console.log(`[DEBUG] Before transfer: senderBalance=${sender.balance}, recipientBalance=${recipient.balance}`);
  
      
      sender.balance -= parseFloat(amount);
      recipient.balance += parseFloat(amount);
  
      await sender.save();
      await recipient.save();
  
      console.log(`[DEBUG] After transfer: senderBalance=${sender.balance}, recipientBalance=${recipient.balance}`);
  
      
      await Transaction.createTransfer(sender, recipient, amount);
  
      console.log(`[DEBUG] Transfer transaction created: sender=${senderEmail}, recipient=${recipientId}, amount=${amount}`);
  
      res.status(200).json({ message: 'Transfer successful', balance: sender.balance });
    } catch (err) {
      console.error(`[ERROR] Error during transfer: ${err.message}`);
      res.status(500).json({ message: 'Server error' });
    } finally {
      locks.delete(senderEmail);
      console.log(`[DEBUG] Transfer lock released for sender: ${senderEmail}`);
    }
  });
  
  router.get('/transactions', authMiddleware, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email });
  
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
      console.error('Error fetching transaction history:', error.message);
      res.status(400).json({ message: error.message });
    }
  });
  

module.exports = router;