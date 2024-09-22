// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Replace with your backend API endpoint for user login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      // Assuming the backend returns a token
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={handleLogin} className="mt-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
