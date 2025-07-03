const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, UserCard, Trade, Auction } = require('../models');
const { Op } = require('sequelize');

router.use(auth);

// GET /api/profile - Get current user's profile info (avatar, username, stats, achievements)
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Calculate stats
    const totalHave = await UserCard.count({ where: { UserId: userId, have: true } });
    const totalWant = await UserCard.count({ where: { UserId: userId, want: true } });
    const tradesCompleted = await Trade.count({
      where: {
        [Op.or]: [
          { offeredBy: userId, status: 'accepted' },
          { targetUserId: userId, status: 'accepted' }
        ]
      }
    });
    const auctionsSold = await Auction.count({ where: { sellerId: userId, status: 'closed', currentBidderId: { [Op.ne]: null } } });
    // Build achievements list based on stats
    const achievements = [];
    if (tradesCompleted >= 1) achievements.push('First Trade Completed');
    if (tradesCompleted >= 5) achievements.push('Experienced Trader');
    if (auctionsSold >= 1) achievements.push('First Auction Sold');
    if (totalHave >= 10) achievements.push('Collector');
    if (totalWant >= 10) achievements.push('Wishlist Keeper');
    // Additional achievements can be added as needed
    res.json({
      username: user.username,
      avatarUrl: user.avatarUrl,
      rating: user.rating,
      stats: {
        totalHave,
        totalWant,
        tradesCompleted,
        auctionsSold
      },
      achievements
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Could not retrieve profile information' });
  }
});

module.exports = router;
