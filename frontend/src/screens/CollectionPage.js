import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CollectionPage() {
  const [haveList, setHaveList] = useState([]);
  const [wantList, setWantList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('');
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    const guestCollection = JSON.parse(localStorage.getItem('guestCollection') || '[]');
    setCollection(guestCollection);
  } else {
    // Вызов API для получения коллекции
  }
}, []);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const res = await axios.get('/api/collection');
        setHaveList(res.data.have);
        setWantList(res.data.want);
      } catch (err) {
        console.error('Error fetching collection:', err);
      }
    };
    fetchCollection();
  }, []);

  // Filter the lists based on search text and type
  const filteredHave = haveList.filter(card =>
    card.name.toLowerCase().includes(filterText.toLowerCase()) &&
    (filterType ? card.type === filterType : true)
  );
  const filteredWant = wantList.filter(card =>
    card.name.toLowerCase().includes(filterText.toLowerCase()) &&
    (filterType ? card.type === filterType : true)
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Collection</h2>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search cards..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="border px-2 py-1"
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border px-2 py-1">
          <option value="">All Types</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Grass">Grass</option>
          <option value="Electric">Electric</option>
          <option value="Psychic">Psychic</option>
          <option value="Fighting">Fighting</option>
          <option value="Darkness">Darkness</option>
          <option value="Metal">Metal</option>
          <option value="Dragon">Dragon</option>
          <option value="Fairy">Fairy</option>
          <option value="Colorless">Colorless</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Cards I Have</h3>
          {filteredHave.length === 0 ? (
            <p>No cards in your collection.</p>
          ) : (
            <ul>
              {filteredHave.map(card => (
                <li key={card.id} className="mb-2 flex items-center">
                  {card.imageUrl ?
                    <img src={card.imageUrl} alt={card.name} className="h-12 mr-2" />
                    : <div className="h-12 w-8 bg-gray-300 mr-2"></div>}
                  <span>{card.name} {card.rarity ? `(${card.rarity})` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Cards I Want</h3>
          {filteredWant.length === 0 ? (
            <p>No cards in your wishlist.</p>
          ) : (
            <ul>
              {filteredWant.map(card => (
                <li key={card.id} className="mb-2 flex items-center">
                  {card.imageUrl ?
                    <img src={card.imageUrl} alt={card.name} className="h-12 mr-2" />
                    : <div className="h-12 w-8 bg-gray-300 mr-2"></div>}
                  <span>{card.name} {card.rarity ? `(${card.rarity})` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
