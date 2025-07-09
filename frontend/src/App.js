import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import CollectionPage from './screens/CollectionPage';
import CardSearchPage from './screens/CardSearchPage';
import TradePage from './screens/TradePage';
import AuctionPage from './screens/AuctionPage';
import ProfilePage from './screens/ProfilePage';
import NavBar from './components/NavBar';

function App() {
  // Simple auth check: if token exists in localStorage
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={token ? <CollectionPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/collection" /> : <LoginPage />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/collection" /> : <RegisterPage />} />
        <Route path="/collection" element={isLoggedIn ? <CollectionPage /> : <Navigate to="/login" />} />
        <Route path="/search" element={isLoggedIn ? <CardSearchPage /> : <Navigate to="/login" />} />
        <Route path="/trade" element={isLoggedIn ? <TradePage /> : <Navigate to="/login" />} />
        <Route path="/auctions" element={isLoggedIn ? <AuctionPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
