// src/components/PlayerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLeagueEntries } from '../api/valorantApi';

function PlayerProfile() {
  const { id } = useParams();
  const [leagueEntries, setLeagueEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLeagueEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLeagueEntries(id, 'na1'); // Replace 'na1' with dynamic region if needed
        setLeagueEntries(data);
      } catch (err) {
        setError('Failed to fetch league entries.');
      }
      setLoading(false);
    };

    getLeagueEntries();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Player League Entries</h2>
      {leagueEntries.length > 0 ? (
        <ul>
          {leagueEntries.map((entry) => (
            <li key={entry.leagueId} className="mb-2 p-2 border rounded">
              <p><strong>Queue Type:</strong> {entry.queueType}</p>
              <p><strong>Tier:</strong> {entry.tier} {entry.rank}</p>
              <p><strong>LP:</strong> {entry.leaguePoints}</p>
              <p><strong>Wins:</strong> {entry.wins}</p>
              <p><strong>Losses:</strong> {entry.losses}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No league entries found.</p>
      )}
    </div>
  );
}

export default PlayerProfile;
