
const Card = require('../models/Card');

// Получить все карточки
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения карточек' });
  }
};

// Получить карточку по id
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения карточки' });
  }
};
