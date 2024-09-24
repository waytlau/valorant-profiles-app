// frontend-new/src/pages/PlayerLookup.jsx
import React, { useState } from 'react';
import { fetchSummonerByName } from '../api/riotApi';
import { useNavigate } from 'react-router-dom';

function PlayerLookup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState('na1'); // Default region
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [isValidFormat, setIsValidFormat] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Validate format
    const regex = /^.+#\d{4}$/;
    if (!regex.test(searchTerm)) {
      setIsValidFormat(false);
      setError('Invalid format. Please use PlayerName#1234.');
      return;
    } else {
      setIsValidFormat(true);
      setError(null);
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchSummonerByName(searchTerm, region);
      // Navigate to the profile page with playerId and region
      navigate(`/profile/${data.id}?region=${region}`);
    } catch (err) {
      setError('Failed to fetch summoner data. Please ensure the summoner name and tagline are correct.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a player (e.g., PlayerName#1234)"
          className={`border p-2 flex-grow mr-2 rounded mb-2 md:mb-0 ${!isValidFormat ? 'border-red-500' : ''}`}
          required
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border p-2 mr-2 rounded mb-2 md:mb-0"
        >
          <option value="na1">North America</option>
          <option value="euw1">Europe West</option>
          <option value="eun1">Europe Nordic & East</option>
          <option value="kr">Korea</option>
          <option value="br1">Brazil</option>
          <option value="oc1">Oceania</option>
          <option value="jp1">Japan</option>
          {/* Add more regions as needed */}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isValidFormat && <p className="text-red-500">Summoner name must include a tagline (e.g., PlayerName#1234).</p>}
    </div>
  );
}

export default PlayerLookup;
