const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Define Card model (represents a Pokémon card type)
const Card = sequelize.define('Card', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pokemonId: {
    type: DataTypes.INTEGER,
    allowNull: true  // National Pokédex number (if applicable)
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true  // e.g., "Fire", "Water", etc. (primary type of the Pokemon)
  },
  generation: {
    type: DataTypes.INTEGER,
    allowNull: true  // e.g., 1 for Gen I, 2 for Gen II, etc.
  },
  rarity: {
    type: DataTypes.STRING,
    allowNull: true  // e.g., "Common", "Rare", "Ultra Rare"
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true  // URL to an image of the card
  }
}, {
  timestamps: false
});

module.exports = Card;
