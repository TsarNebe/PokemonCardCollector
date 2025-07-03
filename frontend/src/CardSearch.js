import React, { useState } from 'react';

const CardSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow p-2 border rounded-l"
        placeholder="Поиск покемон-карты..."
      />
      <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r">
        Поиск
      </button>
    </div>
  );
};

export default CardSearch;
