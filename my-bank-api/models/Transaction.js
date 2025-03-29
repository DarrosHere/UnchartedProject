const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.type === 'deposit'; 
    },
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'], 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.type === 'transfer'; 
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

TransactionSchema.statics.createTransfer = async function (sender, recipient, amount) {
  await this.create({
    userId: sender._id,
    type: 'transfer',
    amount: amount,
    recipientId: recipient._id,
  });

  await this.create({
    userId: recipient._id,
    senderId: sender._id,
    type: 'deposit',
    amount: amount,
  });
};


TransactionSchema.statics.createWithdrawal = async function (user, amount) {
  await this.create({
    userId: user._id,
    type: 'withdraw',
    amount: amount,
  });
};

module.exports = mongoose.model('Transaction', TransactionSchema);