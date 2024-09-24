// src/pages/PlayerLookup.jsx
import React, { useState } from 'react';
import { fetchPUUIDByRiotID } from '../api/riotApi';
import { useNavigate } from 'react-router-dom';

function PlayerLookup() {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [region, setRegion] = useState('na1');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!gameName.trim() || !tagLine.trim()) {
      setError('Please enter both game name and tagline.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const puuid = await fetchPUUIDByRiotID(gameName.trim(), tagLine.trim());
      // Navigate to the profile page with puuid
      navigate(`/profile/${puuid}`);
    } catch (err) {
      setError('Failed to fetch player data. Please check the game name, tagline, and region.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Game Name (e.g., Alan)"
          className="border p-2 flex-grow mr-2 rounded mb-2 md:mb-0"
          required
        />
        <input
          type="text"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="Tagline (e.g., 000)"
          className="border p-2 flex-grow mr-2 rounded mb-2 md:mb-0"
          required
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border p-2 mr-2 rounded mb-2 md:mb-0"
        >
          <option value="na1">NA</option>
          <option value="euw1">EUW</option>
          {/* Add other regions as needed */}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default PlayerLookup;
