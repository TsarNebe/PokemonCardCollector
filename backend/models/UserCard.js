const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Card = require('./Card');

// Define UserCard model (join table between User and Card)
const UserCard = sequelize.define('UserCard', {
  have: {
    type: DataTypes.BOOLEAN,
    defaultValue: false  // true if user has this card
  },
  want: {
    type: DataTypes.BOOLEAN,
    defaultValue: false  // true if user wants this card
  }
}, {
  timestamps: false
});
// Associations
User.belongsToMany(Card, { through: UserCard });
Card.belongsToMany(User, { through: UserCard });
module.exports = UserCard;
