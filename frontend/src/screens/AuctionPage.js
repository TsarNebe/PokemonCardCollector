import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [myHaveCards, setMyHaveCards] = useState([]);
  const [cardId, setCardId] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [duration, setDuration] = useState('24');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get('/api/auctions');
        setAuctions(res.data);
      } catch (err) {
        console.error('Error fetching auctions:', err);
      }
    };
    const fetchCollection = async () => {
      try {
        const res = await axios.get('/api/collection');
        setMyHaveCards(res.data.have);
      } catch (err) {
        console.error('Error fetching collection for auction:', err);
      }
    };
    fetchAuctions();
    fetchCollection();
  }, []);

  const createAuction = async () => {
    try {
      setMessage('');
      await axios.post('/api/auctions', { cardId, startingBid: parseFloat(startingBid) || 0, durationHours: parseInt(duration) });
      setMessage('Auction created successfully!');
      // Remove the card from local have list (since it's now in auction)
      setMyHaveCards(prev => prev.filter(card => card.id !== parseInt(cardId)));
      // Refresh auctions list
      const res = await axios.get('/api/auctions');
      setAuctions(res.data);
      // Reset form
      setCardId('');
      setStartingBid('');
      setDuration('24');
    } catch (err) {
      console.error('Create auction error:', err);
      setMessage(err.response?.data?.error || 'Failed to create auction');
    }
  };

  const placeBid = async (auctionId, currentBid) => {
    const bidAmount = prompt('Enter your bid amount:', currentBid + 1);
    if (!bidAmount) return;
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      alert('Invalid bid amount.');
      return;
    }
    try {
      await axios.post(`/api/auctions/${auctionId}/bid`, { amount });
      // Refresh auctions list
      const res = await axios.get('/api/auctions');
      setAuctions(res.data);
    } catch (err) {
      console.error('Bid error:', err);
      alert(err.response?.data?.error || 'Failed to place bid');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Auctions</h2>
      {message && <div className="mb-4 text-center text-green-600">{message}</div>}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Create Auction</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="mb-2">
            <label className="mr-2">Card:</label>
            <select value={cardId} onChange={e => setCardId(e.target.value)} className="border px-2 py-1">
              <option value="">-- Select a card --</option>
              {myHaveCards.map(card => (
                <option key={card.id} value={card.id}>{card.name} {card.rarity ? `(${card.rarity})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="mr-2">Starting Bid:</label>
            <input
              type="number"
              step="0.01"
              value={startingBid}
              onChange={e => setStartingBid(e.target.value)}
              className="border px-2 py-1"
            />
          </div>
          <div className="mb-2">
            <label className="mr-2">Duration (hours):</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="border px-2 py-1"
            />
          </div>
          <button onClick={createAuction} className="bg-purple-600 text-white px-4 py-2 rounded">
            Start Auction
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Active Auctions</h3>
        {auctions.length === 0 ? (
          <p>No active auctions at the moment.</p>
        ) : (
          <ul>
            {auctions.map(auc => (
              <li key={auc.id} className="mb-2 p-2 bg-white rounded shadow">
                <p>
                  <strong>Auction ID:</strong> {auc.id} - Card ID: {auc.cardId}, Current Bid: ${auc.currentBid.toFixed(2)},
                  Ends at: {new Date(auc.endTime).toLocaleString()}
                </p>
                <button
                  onClick={() => placeBid(auc.id, auc.currentBid)}
                  className="mt-1 px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Place Bid
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AuctionPage;
