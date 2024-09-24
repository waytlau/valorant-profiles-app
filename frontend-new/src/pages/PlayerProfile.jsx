// src/pages/PlayerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSummonerByPUUID } from '../api/riotApi';
import CommentsSection from '../components/CommentsSection';

function PlayerProfile() {
  const { puuid } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPlayerData = async () => {
      try {
        const data = await fetchSummonerByPUUID(puuid, 'na1'); // Replace 'na1' with the appropriate region if needed
        setPlayerData(data);
      } catch (err) {
        setError('Failed to fetch player profile.');
      }
    };

    getPlayerData();
  }, [puuid]);

  if (error) {
    return <div className="container mx-auto p-4">{error}</div>;
  }

  if (!playerData) {
    return <div className="container mx-auto p-4">Loading player profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Profile Information */}
      <div className="flex items-center mb-6">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/${playerData.profileIconId}.png`}
          alt="Profile Icon"
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl font-bold">{playerData.name}</h2>
          <p>Summoner Level: {playerData.summonerLevel}</p>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection playerPUUID={puuid} />
    </div>
  );
}

export default PlayerProfile;
