const { Card, UserCard } = require('../models');

exports.addToCollection = async (req, res) => {
  try {
    const { name, type, generation, rarity, imageUrl, have, want } = req.body;
    let card = await Card.findOne({ where: { name } });
    if (!card) {
      card = await Card.create({ name, type, generation, rarity, imageUrl });
    }
    await UserCard.create({
      UserId: req.user.userId,
      CardId: card.id,
      have: !!have,
      want: !!want
    });
    res.status(201).json({ message: 'Card added to collection', card });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении карты' });
  }
};