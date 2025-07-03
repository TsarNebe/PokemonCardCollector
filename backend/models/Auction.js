const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Define Auction model (cards put up for auction)
const Auction = sequelize.define('Auction', {
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false  // Card being auctioned
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false  // User who created the auction
  },
  currentBid: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currentBidderId: {
    type: DataTypes.INTEGER,
    allowNull: true  // User who placed the highest bid (null if no bids yet)
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false  // time when auction ends
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'  // "active" or "closed"
  }
}, {
  timestamps: true
});

module.exports = Auction;
