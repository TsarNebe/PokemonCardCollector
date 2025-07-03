import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigate('/collection');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      {error && <div className="text-red-500 mb-3 text-center">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-2">Login</button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
