import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold">Pokédex 2025</Link>
      </div>
      <div>
        {token ? (
          <>
            <Link to="/collection" className="mx-2">My Collection</Link>
            <Link to="/search" className="mx-2">Search Cards</Link>
            <Link to="/trade" className="mx-2">Trades</Link>
            <Link to="/auctions" className="mx-2">Auctions</Link>
            <Link to="/profile" className="mx-2">Profile</Link>
            <button onClick={handleLogout} className="mx-2 text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mx-2">Login</Link>
            <Link to="/register" className="mx-2">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
