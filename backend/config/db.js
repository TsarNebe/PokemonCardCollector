const { Sequelize } = require('sequelize');

// Database configuration - using environment variables or defaults
const DB_NAME = process.env.DB_NAME || 'pokemon';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'postgres';
const DB_HOST = process.env.DB_HOST || 'db';
const DB_PORT = process.env.DB_PORT || 5432;

// Initialize Sequelize for Postgres
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false // disable logging for cleanliness
});

module.exports = sequelize;
