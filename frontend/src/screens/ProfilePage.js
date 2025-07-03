import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <div className="flex items-center mb-4">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full mr-4" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-400 mr-4 flex items-center justify-center text-white">
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{profile.username}</h3>
          <p className="text-sm text-gray-600">Rating: {profile.rating}</p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Statistics:</h4>
        <ul className="list-disc list-inside">
          <li>Total Cards Owned: {profile.stats.totalHave}</li>
          <li>Total Wishlist Items: {profile.stats.totalWant}</li>
          <li>Trades Completed: {profile.stats.tradesCompleted}</li>
          <li>Auctions Sold: {profile.stats.auctionsSold}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold">Achievements:</h4>
        {profile.achievements.length > 0 ? (
          <ul className="list-disc list-inside">
            {profile.achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        ) : (
          <p>No achievements yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
