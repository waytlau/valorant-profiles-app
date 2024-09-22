// src/pages/PlayerLookup.js
import React, { useState } from 'react';
import axios from 'axios';

function PlayerLookup() {
  const [username, setUsername] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setPlayerData(null);

    try {
      // Replace with your backend API endpoint for player lookup
      const response = await axios.get(`http://localhost:5000/api/players?username=${username}`);
      setPlayerData(response.data);
    } catch (err) {
      setError('Player not found or an error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold">Player Lookup</h1>
      <form onSubmit={handleSearch} className="mt-4 flex">
        <input
          type="text"
          placeholder="Enter Valorant Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-2 rounded-l-md w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {playerData && (
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <h2 className="text-xl font-bold">Player Profile: {playerData.username}</h2>
          <p>Rank: {playerData.rank}</p>
          <p>Region: {playerData.region}</p>
          {/* Add more player details as needed */}
          <a href={`/profile/${playerData.id}`} className="text-blue-500 underline mt-2 block">
            View Full Profile
          </a>
        </div>
      )}
    </div>
  );
}

export default PlayerLookup;
