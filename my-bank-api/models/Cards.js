const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
});

module.exports = mongoose.model('Card', CardSchema);