const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Transaction = require('./Transaction'); 
const Card = require('./Cards'); 
const crypto = require('crypto'); 

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'UserName',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card', 
    },
  ],
  resetToken: { 
    type: String,
  },
  resetTokenExpiry: { 
    type: Date,
  },
});


UserSchema.methods.withdraw = async function (amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  await this.save();

 
  await Transaction.create({
    userId: this._id,
    type: 'withdraw',
    amount,
  });

  console.log(`User ${this._id} withdrew ${amount}`);
};


UserSchema.methods.transfer = async function (recipientId, amount) {
  const recipient = await mongoose.model('User').findById(recipientId);
  if (!recipient) {
    throw new Error('Recipient not found');
  }

  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }

  this.balance -= amount;
  recipient.balance += amount;

  await this.save();
  await recipient.save();

  await Transaction.create({
    userId: this._id,
    type: 'transfer',
    amount,
    recipientId,
    senderId: this._id,
  });

  console.log(`User ${this._id} transferred ${amount} to ${recipientId}`);
};


UserSchema.methods.getTransactionHistory = async function () {
  try {
    // Підвантажуємо транзакції
    const transactions = await Transaction.find({ userId: this._id })
      .populate('senderId', 'name email') 
      .populate('recipientId', 'name email') 
      .sort({ date: -1 });

    console.log('Transactions with populated sender and recipient:', transactions); 

    return transactions;
  } catch (err) {
    console.error('Error fetching transaction history:', err.message);
    throw err;
  }
};


UserSchema.methods.createCard = async function (cardNumber, expirationDate, cvv) {

  const formattedDate = new Date(expirationDate).toISOString().split('T')[0];

  const card = await Card.create({
    cardNumber,
    expirationDate: formattedDate, 
    cvv,
    userId: this._id,
  });

  this.cards.push(card._id);
  await this.save();

  console.log(`User ${this._id} created card ${cardNumber}`);
  return card;
};


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    if (this.password.startsWith('$2b$')) {
      return next(); 
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = resetToken;
  this.resetTokenExpiry = Date.now() + 3600000; 
  console.log(`Generated reset token for user ${this._id}: ${resetToken}`);
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
