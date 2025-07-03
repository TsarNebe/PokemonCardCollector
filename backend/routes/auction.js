const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { UserCard, Auction, User } = require('../models');
const { Op } = require('sequelize');

router.use(auth);

// GET /api/auctions - List all active auctions
router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.findAll({ where: { status: 'active', endTime: { [Op.gt]: new Date() } } });
    res.json(auctions);
  } catch (err) {
    console.error('Fetch auctions error:', err);
    res.status(500).json({ error: 'Could not retrieve auctions' });
  }
});

// POST /api/auctions - Create a new auction for a card
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardId, startingBid, durationHours } = req.body;
    // Check that user owns the card
    const userCard = await UserCard.findOne({ where: { UserId: userId, CardId: cardId, have: true } });
    if (!userCard) {
      return res.status(400).json({ error: 'You do not own this card' });
    }
    // Create auction
    const endTime = new Date(Date.now() + (durationHours || 24) * 60 * 60 * 1000);
    const auction = await Auction.create({
      cardId,
      sellerId: userId,
      currentBid: startingBid || 0,
      currentBidderId: null,
      endTime,
      status: 'active'
    });
    // (Optionally, mark that user no longer has the card available, e.g., userCard.have=false if we want to lock it)
    userCard.have = false;
    await userCard.save();
    res.json({ message: 'Auction created', auctionId: auction.id });
  } catch (err) {
    console.error('Create auction error:', err);
    res.status(500).json({ error: 'Could not create auction' });
  }
});

// POST /api/auctions/:auctionId/bid - Place a bid on an auction
router.post('/:auctionId/bid', async (req, res) => {
  try {
    const userId = req.user.id;
    const auctionId = req.params.auctionId;
    const { amount } = req.body;
    const auction = await Auction.findOne({ where: { id: auctionId, status: 'active' } });
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found or not active' });
    }
    if (new Date() >= auction.endTime) {
      return res.status(400).json({ error: 'Auction has already ended' });
    }
    if (amount <= auction.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }
    // Update auction with new highest bid
    auction.currentBid = amount;
    auction.currentBidderId = userId;
    await auction.save();
    res.json({ message: 'Bid placed', currentBid: auction.currentBid });
  } catch (err) {
    console.error('Place bid error:', err);
    res.status(500).json({ error: 'Could not place bid' });
  }
});

// (Optional: A route to manually end an auction or for a scheduled job to mark auctions as closed and transfer card)
router.put('/:auctionId/close', async (req, res) => {
  try {
    const userId = req.user.id;
    const auctionId = req.params.auctionId;
    const auction = await Auction.findOne({ where: { id: auctionId } });
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    if (auction.sellerId !== userId) {
      return res.status(403).json({ error: 'Only the seller can close the auction manually' });
    }
    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction is not active' });
    }
    // Close the auction
    auction.status = 'closed';
    await auction.save();
    // If there was a bidder, transfer card ownership to winner and handle payment (not implemented fully here)
    if (auction.currentBidderId) {
      // Give the card to the winner
      await UserCard.create({ UserId: auction.currentBidderId, CardId: auction.cardId, have: true });
      // Increase seller's rating for a successful sale
      const seller = await User.findByPk(userId);
      if (seller) {
        seller.rating += 1;
        await seller.save();
      }
    }
    res.json({ message: 'Auction closed' });
  } catch (err) {
    console.error('Close auction error:', err);
    res.status(500).json({ error: 'Could not close auction' });
  }
});

module.exports = router;
