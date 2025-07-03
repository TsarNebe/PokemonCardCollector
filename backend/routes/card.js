const express = require('express');
const router = express.Router();
const { searchCards } = require('../utils/pokeapi');

// GET /api/cards/search - Search for cards by name/type/id (query parameters)
router.get('/search', async (req, res) => {
  try {
    const { name, type, generation, id } = req.query;
    const results = await searchCards({ name, type, generation: generation ? parseInt(generation) : undefined, id });
    res.json(results);
  } catch (err) {
    console.error('Card search error:', err);
    res.status(500).json({ error: 'Failed to search for cards' });
  }
});

module.exports = router;
