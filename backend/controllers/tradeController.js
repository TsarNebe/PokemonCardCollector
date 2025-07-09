
const { Trade, User, Card } = require('../models');

// Получить все трейды
exports.getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.findAll({ include: [User, Card] });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения трейдов' });
  }
};

// Создать трейд
exports.createTrade = async (req, res) => {
  try {
    const { offeredCardId, requestedCardId, targetUserId } = req.body;
    const offeredBy = req.user.userId;  // assuming auth middleware sets req.user.userId
    const trade = await Trade.create({ offeredCardId, requestedCardId, offeredBy, targetUserId });
    res.status(201).json(trade);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания трейда' });
  }
};
