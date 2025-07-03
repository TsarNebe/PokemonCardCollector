import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TradePage() {
  const [myHaveCards, setMyHaveCards] = useState([]);
  const [myWantCards, setMyWantCards] = useState([]);
  const [offeredCardId, setOfferedCardId] = useState('');
  const [requestedCardId, setRequestedCardId] = useState('');
  const [targetUsername, setTargetUsername] = useState('');
  const [message, setMessage] = useState('');
  const [tradeOffers, setTradeOffers] = useState([]);  // incoming and outgoing trades

  useEffect(() => {
    // Load collection to populate dropdowns
    const fetchCollection = async () => {
      try {
        const res = await axios.get('/api/collection');
        setMyHaveCards(res.data.have);
        setMyWantCards(res.data.want);
      } catch (err) {
        console.error('Error loading collection for trades:', err);
      }
    };
    // Load current trade offers involving user
    const fetchTrades = async () => {
      try {
        const res = await axios.get('/api/trades');
        setTradeOffers(res.data);
      } catch (err) {
        console.error('Error loading trades:', err);
      }
    };
    fetchCollection();
    fetchTrades();
  }, []);

  const proposeTrade = async () => {
    try {
      setMessage('');
      const res = await axios.post('/api/trades', { offeredCardId, requestedCardId, targetUsername });
      setMessage('Trade offer sent successfully!');
      // Reset selected values
      setOfferedCardId('');
      setRequestedCardId('');
      setTargetUsername('');
      // Refresh trade offers list
      const updatedTrades = await axios.get('/api/trades');
      setTradeOffers(updatedTrades.data);
    } catch (err) {
      console.error('Trade proposal error:', err);
      setMessage(err.response?.data?.error || 'Failed to send trade offer');
    }
  };

  const acceptTrade = async (tradeId) => {
    try {
      await axios.put(`/api/trades/${tradeId}/accept`);
      setMessage('Trade accepted and completed.');
      // Update trade list and collection (to reflect swapped cards)
      const updatedTrades = await axios.get('/api/trades');
      setTradeOffers(updatedTrades.data);
      const updatedCollection = await axios.get('/api/collection');
      setMyHaveCards(updatedCollection.data.have);
      setMyWantCards(updatedCollection.data.want);
    } catch (err) {
      console.error('Accept trade error:', err);
      setMessage(err.response?.data?.error || 'Failed to accept trade');
    }
  };

  const declineTrade = async (tradeId) => {
    try {
      await axios.put(`/api/trades/${tradeId}/decline`);
      setMessage('Trade declined.');
      // Refresh trade offers list
      const updatedTrades = await axios.get('/api/trades');
      setTradeOffers(updatedTrades.data);
    } catch (err) {
      console.error('Decline trade error:', err);
      setMessage(err.response?.data?.error || 'Failed to decline trade');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trade Cards</h2>
      {message && <div className="mb-4 text-center text-blue-600">{message}</div>}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Propose a Trade</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="mb-2 sm:mb-0">
            <label className="mr-2">Offer:</label>
            <select value={offeredCardId} onChange={e => setOfferedCardId(e.target.value)} className="border px-2 py-1">
              <option value="">-- Select a card you have --</option>
              {myHaveCards.map(card => (
                <option key={card.id} value={card.id}>{card.name} {card.rarity ? `(${card.rarity})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="mb-2 sm:mb-0">
            <label className="mr-2">Request:</label>
            <select value={requestedCardId} onChange={e => setRequestedCardId(e.target.value)} className="border px-2 py-1">
              <option value="">-- Select a card you want --</option>
              {myWantCards.map(card => (
                <option key={card.id} value={card.id}>{card.name} {card.rarity ? `(${card.rarity})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="mb-2 sm:mb-0">
            <label className="mr-2">Trade with (username):</label>
            <input
              type="text"
              value={targetUsername}
              onChange={e => setTargetUsername(e.target.value)}
              placeholder="Optional"
              className="border px-2 py-1"
            />
          </div>
          <button onClick={proposeTrade} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Send Offer
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">My Trade Offers</h3>
        {tradeOffers.length === 0 ? (
          <p>No current trade offers.</p>
        ) : (
          <ul>
            {tradeOffers.map(trade => (
              <li key={trade.id} className="mb-2 p-2 bg-white rounded shadow">
                <p>
                  <strong>Offer ID:</strong> {trade.id} -
                  Offered Card ID: {trade.offeredCardId}, Requested Card ID: {trade.requestedCardId},
                  Status: <span className={trade.status === 'pending' ? 'text-yellow-600' : trade.status === 'accepted' ? 'text-green-600' : 'text-red-600'}>
                    {trade.status}
                  </span>
                </p>
                {trade.status === 'pending' && trade.targetUserId && (
                  trade.targetUserId === parseInt(localStorage.getItem('userId') || '0')
                    ? <div className="mt-1">
                        <button onClick={() => acceptTrade(trade.id)} className="mr-2 px-3 py-1 bg-green-500 text-white rounded">Accept</button>
                        <button onClick={() => declineTrade(trade.id)} className="px-3 py-1 bg-red-500 text-white rounded">Decline</button>
                      </div>
                    : <p className="text-sm text-gray-600">Waiting for other user to respond...</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TradePage;
