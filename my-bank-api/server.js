const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/cardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();


app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); 
app.use(cookieParser()); 


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); 
  });


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));