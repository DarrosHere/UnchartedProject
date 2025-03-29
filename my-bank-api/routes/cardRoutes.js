const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Card = require('../models/Cards');
const router = express.Router();

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

router.get('/cards', authMiddleware, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email }).populate('cards');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
     
      const formattedCards = user.cards.map((card) => ({
        ...card._doc,
        expirationDate: card.expirationDate.toISOString().split('T')[0], 
      }));
  
      res.status(200).json(formattedCards);
    } catch (error) {
      console.error('Error fetching cards:', error.message);
      res.status(400).json({ message: error.message });
    }
  });
  

router.post('/cards', authMiddleware, async (req, res) => {
  try {
    const { cardNumber, expirationDate, cvv } = req.body;

    if (!cardNumber || !expirationDate || !cvv) {
      return res.status(400).json({ message: 'Invalid card details' });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const card = await user.createCard(cardNumber, expirationDate, cvv);

   
    const populatedCard = await Card.findById(card._id);

    if (!populatedCard) {
      throw new Error('Failed to populate card details');
    }

    res.status(201).json(populatedCard); 
  } catch (error) {
    console.error('Error creating card:', error.message);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;