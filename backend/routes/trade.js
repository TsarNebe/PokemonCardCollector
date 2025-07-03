const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, UserCard, Trade } = require('../models');
const { Op } = require('sequelize');

router.use(auth);

// GET /api/trades - Get all trades involving the current user (as offerer or target)
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [
          { offeredBy: userId },
          { targetUserId: userId }
        ]
      }
    });
    res.json(trades);
  } catch (err) {
    console.error('Fetch trades error:', err);
    res.status(500).json({ error: 'Could not retrieve trades' });
  }
});

// POST /api/trades - Create a new trade offer
router.post('/', async (req, res) => {
  try {
    const offeredBy = req.user.id;
    const { offeredCardId, requestedCardId, targetUsername } = req.body;
    // Validate that offeredCard belongs to current user
    const offeredCardEntry = await UserCard.findOne({ where: { UserId: offeredBy, CardId: offeredCardId, have: true } });
    if (!offeredCardEntry) {
      return res.status(400).json({ error: 'You do not have the offered card' });
    }
    // Find target user by username (if specified)
    let targetUser = null;
    if (targetUsername) {
      targetUser = await User.findOne({ where: { username: targetUsername } });
      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }
    }
    // If target user is not specified, try to find any user who has the requested card
    let targetUserId = targetUser ? targetUser.id : null;
    if (!targetUserId) {
      const userCardWithRequested = await UserCard.findOne({ where: { CardId: requestedCardId, have: true, UserId: { [Op.ne]: offeredBy } } });
      if (!userCardWithRequested) {
        return res.status(400).json({ error: 'No user with the requested card is available for trade' });
      }
      targetUserId = userCardWithRequested.UserId;
    }
    // Ensure the target user actually has the requested card
    const targetHasCard = await UserCard.findOne({ where: { UserId: targetUserId, CardId: requestedCardId, have: true } });
    if (!targetHasCard) {
      return res.status(400).json({ error: 'Target user does not have the requested card' });
    }
    // Create trade offer
    const trade = await Trade.create({ offeredCardId, requestedCardId, offeredBy, targetUserId, status: 'pending' });
    res.json({ message: 'Trade offer created', tradeId: trade.id });
    // (Optional: Notify the target user via some notification system - not implemented here)
  } catch (err) {
    console.error('Create trade error:', err);
    res.status(500).json({ error: 'Could not create trade offer' });
  }
});

// PUT /api/trades/:tradeId/accept - Accept a trade offer
router.put('/:tradeId/accept', async (req, res) => {
  try {
    const userId = req.user.id;
    const tradeId = req.params.tradeId;
    const trade = await Trade.findOne({ where: { id: tradeId, status: 'pending' } });
    if (!trade) {
      return res.status(404).json({ error: 'Trade offer not found' });
    }
    if (trade.targetUserId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to accept this trade' });
    }
    // Perform the trade: swap the cards between users
    // Remove requestedCard from target (current user) and add to offeredBy user
    const targetCard = await UserCard.findOne({ where: { UserId: userId, CardId: trade.requestedCardId, have: true } });
    const offererCard = await UserCard.findOne({ where: { UserId: trade.offeredBy, CardId: trade.offeredCardId, have: true } });
    if (!targetCard || !offererCard) {
      return res.status(400).json({ error: 'Trade cannot be completed (cards not found or already traded)' });
    }
    // Target user loses the requestedCard and gains offeredCard
    targetCard.have = false;
    await targetCard.save();
    await UserCard.create({ UserId: userId, CardId: trade.offeredCardId, have: true, want: false });
    // Offerer loses offeredCard and gains requestedCard
    offererCard.have = false;
    await offererCard.save();
    await UserCard.create({ UserId: trade.offeredBy, CardId: trade.requestedCardId, have: true, want: false });
    // Update trade status to accepted
    trade.status = 'accepted';
    await trade.save();
    // Increment users' rating (as a simple way to reward successful trade)
    const offerer = await User.findByPk(trade.offeredBy);
    const target = await User.findByPk(userId);
    if (offerer) {
      offerer.rating += 1;
      await offerer.save();
    }
    if (target) {
      target.rating += 1;
      await target.save();
    }
    res.json({ message: 'Trade accepted and completed' });
  } catch (err) {
    console.error('Accept trade error:', err);
    res.status(500).json({ error: 'Could not accept trade' });
  }
});

// PUT /api/trades/:tradeId/decline - Decline a trade offer
router.put('/:tradeId/decline', async (req, res) => {
  try {
    const userId = req.user.id;
    const tradeId = req.params.tradeId;
    const trade = await Trade.findOne({ where: { id: tradeId, status: 'pending' } });
    if (!trade) {
      return res.status(404).json({ error: 'Trade offer not found' });
    }
    if (trade.targetUserId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to decline this trade' });
    }
    trade.status = 'declined';
    await trade.save();
    res.json({ message: 'Trade declined' });
    // (Optional: Notify the offerer about the decline - not implemented)
  } catch (err) {
    console.error('Decline trade error:', err);
    res.status(500).json({ error: 'Could not decline trade' });
  }
});

module.exports = router;
