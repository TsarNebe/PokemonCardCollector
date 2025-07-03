
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
    const { senderId, receiverId, offeredCardId, requestedCardId } = req.body;
    const trade = await Trade.create({ senderId, receiverId, offeredCardId, requestedCardId });
    res.status(201).json(trade);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка создания трейда' });
  }
};
