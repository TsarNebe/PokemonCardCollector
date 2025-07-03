const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Card, UserCard } = require('../models');

// Use auth middleware for all routes below
router.use(auth);

// GET /api/collection - Get current user's card collection (have and want lists)
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all UserCard entries for this user and include card details
    const userCards = await UserCard.findAll({
      where: { UserId: userId },
      include: [ Card ]
    });
    // Format response: separate have and want lists
    const haveList = [];
    const wantList = [];
    userCards.forEach(uc => {
      const card = uc.Card;
      const cardData = {
        id: card.id,
        name: card.name,
        type: card.type,
        generation: card.generation,
        rarity: card.rarity,
        imageUrl: card.imageUrl
      };
      if (uc.have) haveList.push(cardData);
      if (uc.want) wantList.push(cardData);
    });
    res.json({ have: haveList, want: wantList });
  } catch (err) {
    console.error('Fetch collection error:', err);
    res.status(500).json({ error: 'Could not retrieve collection' });
  }
});

// POST /api/collection - Add a card to user's collection (have or want or both)
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, pokemonId, type, generation, rarity, imageUrl, have, want } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Card name is required' });
    }
    // Find or create the Card in the database
    let card = await Card.findOne({ where: { name } });
    if (!card) {
      // Create new card entry if not found
      card = await Card.create({ name, pokemonId, type, generation, rarity, imageUrl });
    }
    // Find or create UserCard entry for this user and card
    let userCard = await UserCard.findOne({ where: { UserId: userId, CardId: card.id } });
    if (!userCard) {
      userCard = await UserCard.create({ UserId: userId, CardId: card.id, have: !!have, want: !!want });
    } else {
      // Update existing entry (e.g., user can mark have or want for an existing card)
      if (have !== undefined) userCard.have = !!have;
      if (want !== undefined) userCard.want = !!want;
      await userCard.save();
    }
    res.json({ message: 'Card updated in collection', cardId: card.id });
  } catch (err) {
    console.error('Add to collection error:', err);
    res.status(500).json({ error: 'Could not update collection' });
  }
});

// PUT /api/collection/:cardId - Update have/want status for a card in collection
router.put('/:cardId', async (req, res) => {
  try {
    const userId = req.user.id;
    const cardId = req.params.cardId;
    const { have, want } = req.body;
    const userCard = await UserCard.findOne({ where: { UserId: userId, CardId: cardId } });
    if (!userCard) {
      return res.status(404).json({ error: 'Card not found in your collection' });
    }
    if (have !== undefined) userCard.have = !!have;
    if (want !== undefined) userCard.want = !!want;
    await userCard.save();
    res.json({ message: 'Collection entry updated' });
  } catch (err) {
    console.error('Update collection error:', err);
    res.status(500).json({ error: 'Could not update collection' });
  }
});

// DELETE /api/collection/:cardId - Remove a card from the user's collection entirely
router.delete('/:cardId', async (req, res) => {
  try {
    const userId = req.user.id;
    const cardId = req.params.cardId;
    const result = await UserCard.destroy({ where: { UserId: userId, CardId: cardId } });
    if (result) {
      res.json({ message: 'Card removed from collection' });
    } else {
      res.status(404).json({ error: 'Card not found in your collection' });
    }
  } catch (err) {
    console.error('Delete collection error:', err);
    res.status(500).json({ error: 'Could not remove card from collection' });
  }
});

module.exports = router;
