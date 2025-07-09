const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Define Trade model (trade offers between users)
const Trade = sequelize.define('Trade', {
  offeredCardId: {
    type: DataTypes.INTEGER,
    allowNull: false  // Card id that is offered by the initiator
  },
  requestedCardId: {
    type: DataTypes.INTEGER,
    allowNull: false  // Card id that is requested in exchange
  },
  offeredBy: {
    type: DataTypes.INTEGER,
    allowNull: false  // User id who initiated the trade
  },
  targetUserId: {
    type: DataTypes.INTEGER,
    allowNull: false  // User id who is asked to trade (who owns the requested card)
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'  // "pending", "accepted", "declined"
  }
}, {
  timestamps: true
});

const User = require('./User');
const Card = require('./Card');
Trade.belongsTo(User, { as: 'sender', foreignKey: 'offeredBy' });
Trade.belongsTo(User, { as: 'receiver', foreignKey: 'targetUserId' });
Trade.belongsTo(Card, { as: 'offeredCard', foreignKey: 'offeredCardId' });
Trade.belongsTo(Card, { as: 'requestedCard', foreignKey: 'requestedCardId' });

module.exports = Trade;
