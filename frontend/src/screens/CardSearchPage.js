import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CardSearchPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchCards = async () => {
      if (query === '' && typeFilter === '' && generationFilter === '') {
        setResults([]);
        return;
      }
      try {
        const params = {};
        if (query) params.name = query;
        if (typeFilter) params.type = typeFilter;
        if (generationFilter) params.generation = generationFilter;
        const res = await axios.get('/api/cards/search', { params });
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };
    // Debounce search to avoid too many calls (500ms delay)
    const delayDebounce = setTimeout(() => {
      searchCards();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query, typeFilter, generationFilter]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Cards</h2>
      <div className="mb-4 flex flex-wrap space-x-4 items-center">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border px-2 py-1"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border px-2 py-1">
          <option value="">Any Type</option>
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
        <select value={generationFilter} onChange={e => setGenerationFilter(e.target.value)} className="border px-2 py-1">
          <option value="">Any Generation</option>
          <option value="1">Gen I</option>
          <option value="2">Gen II</option>
          <option value="3">Gen III</option>
          <option value="4">Gen IV</option>
          <option value="5">Gen V</option>
          <option value="6">Gen VI</option>
          <option value="7">Gen VII</option>
          <option value="8">Gen VIII</option>
          <option value="9">Gen IX</option>
        </select>
      </div>
      {results.length > 0 ? (
        <ul>
          {results.map(card => (
            <li key={card.id || card.name} className="mb-3 p-2 bg-white rounded shadow flex items-center">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} className="h-16 mr-4" />
              ) : (
                <div className="h-16 w-12 bg-gray-300 mr-4" />
              )}
              <div>
                <h4 className="font-semibold">{card.name}</h4>
                <p className="text-sm">
                  {card.type ? `Type: ${card.type}` : ''} {card.generation ? `Gen: ${card.generation}` : ''} {card.rarity ? `Rarity: ${card.rarity}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>{query || typeFilter || generationFilter ? 'No cards found.' : 'Start typing to search for cards.'}</p>
      )}
    </div>
  );
}

export default CardSearchPage;
