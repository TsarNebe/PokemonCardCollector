// Import all models
const User = require('./User');
const Card = require('./Card');
const UserCard = require('./UserCard');
const Trade = require('./Trade');
const Auction = require('./Auction');

// Set up model associations

// User <-> Card through UserCard (Many-to-Many)
User.belongsToMany(Card, { through: UserCard });
Card.belongsToMany(User, { through: UserCard });
User.hasMany(UserCard);
Card.hasMany(UserCard);
UserCard.belongsTo(User);
UserCard.belongsTo(Card);

// Trade relations
Trade.belongsTo(User, { as: 'offerer', foreignKey: 'offeredBy' });
Trade.belongsTo(User, { as: 'target', foreignKey: 'targetUserId' });
Trade.belongsTo(Card, { as: 'offeredCard', foreignKey: 'offeredCardId' });
Trade.belongsTo(Card, { as: 'requestedCard', foreignKey: 'requestedCardId' });

// Auction relations
Auction.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
Auction.belongsTo(User, { as: 'highestBidder', foreignKey: 'currentBidderId' });
Auction.belongsTo(Card, { as: 'card', foreignKey: 'cardId' });

// Export models and sequelize
module.exports = {
  User,
  Card,
  UserCard,
  Trade,
  Auction
};
