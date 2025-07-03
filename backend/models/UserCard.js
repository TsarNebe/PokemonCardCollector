const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

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

module.exports = UserCard;
