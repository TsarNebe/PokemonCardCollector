// Load environment variables (for JWT secret, DB config, etc.)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');  // Sequelize instance

// Middlewares
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collection');
const tradeRoutes = require('./routes/trade');
const auctionRoutes = require('./routes/auction');
const profileRoutes = require('./routes/profile');
const cardRoutes = require('./routes/card');

// Use routes (prefix with /api for clarity)
app.use('/api/auth', authRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cards', cardRoutes);

// Base route (optional)
app.get('/', (req, res) => {
  res.send('Pokédex 2025 Trading Card Game API is running');
});

// Connect to the database and start server
const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    // Sync models (for dev, use { alter: true } or { force: true } as needed)
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
  });
