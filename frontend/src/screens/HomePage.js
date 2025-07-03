import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [featuredCards, setFeaturedCards] = useState([]);

  useEffect(() => {
    // Fetch some featured rare cards from the API or external source
    const fetchFeatured = async () => {
      try {
        // Example: fetch 3 rare cards (this could call our backend or directly an external API)
        const res = await axios.get('/api/cards/search?rarity=Rare');
        setFeaturedCards(res.data.slice(0, 3));  // take first 3 results as showcase
      } catch (err) {
        console.error('Error fetching featured cards:', err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Pokédex 2025</h1>
      <p className="mb-6">Collect, trade, and auction Pokémon cards!</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {featuredCards.map(card => (
          <div key={card.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-center mb-2">{card.name}</h2>
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.name} className="mx-auto mb-2 max-h-40" />
            ) : (
              <div className="h-32 bg-gray-200 flex items-center justify-center mb-2">No Image</div>
            )}
            <p className="text-sm text-center">{card.rarity ? `${card.rarity} Card` : 'Pokémon Card'}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <a href="/search" className="bg-blue-500 text-white px-4 py-2 rounded">Find a Card</a>
        <a href="/collection" className="bg-green-500 text-white px-4 py-2 rounded">Add to Collection</a>
        <a href="/trade" className="bg-yellow-500 text-white px-4 py-2 rounded">Trade Cards</a>
      </div>
    </div>
  );
}

export default HomePage;
