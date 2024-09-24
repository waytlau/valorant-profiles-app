// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchPUUIDByRiotID, fetchSummonerByPUUID } from '../api/riotApi';

function UserProfile() {
  const [user] = useAuthState(auth);
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user data from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setGameName(userData.gameName || '');
            setTagLine(userData.tagLine || '');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  // Fetch Riot data when gameName and tagLine are set
  useEffect(() => {
    const fetchRiotData = async () => {
      if (gameName && tagLine) {
        try {
          const puuid = await fetchPUUIDByRiotID(gameName, tagLine);
          const summonerData = await fetchSummonerByPUUID(puuid, 'na1'); // Adjust region as needed
          setPlayerData(summonerData);
        } catch (err) {
          console.error('Error fetching Riot data:', err);
          setError('Failed to fetch Riot data. Please ensure your Riot ID is correct.');
        }
      }
    };
    fetchRiotData();
  }, [gameName, tagLine]);

  const handleSaveRiotID = async (e) => {
    e.preventDefault();
    if (!gameName.trim() || !tagLine.trim()) {
      setError('Please enter both game name and tagline.');
      return;
    }

    try {
      // Update user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          gameName: gameName.trim(),
          tagLine: tagLine.trim(),
        },
        { merge: true }
      );
      setError(null);
      alert('Riot ID saved successfully!');
    } catch (err) {
      console.error('Error saving Riot ID:', err);
      setError('Failed to save Riot ID.');
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      {/* Riot ID Form */}
      <form onSubmit={handleSaveRiotID} className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Associate Your Riot ID</h3>
        <div className="flex flex-col md:flex-row mb-2">
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Game Name (e.g., sheesh)"
            className="border p-2 flex-grow mr-2 rounded mb-2 md:mb-0"
            required
          />
          <input
            type="text"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            placeholder="Tagline (e.g., 1337)"
            className="border p-2 flex-grow mr-2 rounded mb-2 md:mb-0"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Riot ID
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Display Riot Data */}
      {playerData && (
        <div className="flex items-center mb-6">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/${playerData.profileIconId}.png`}
            alt="Profile Icon"
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h3 className="text-2xl font-bold">
              {playerData.name}#{tagLine}
            </h3>
            <p>Summoner Level: {playerData.summonerLevel}</p>
          </div>
        </div>
      )}

      {/* Additional profile information and actions */}
    </div>
  );
}

export default UserProfile;
