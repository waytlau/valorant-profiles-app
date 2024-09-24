// src/api/valorantApi.js
import axios from 'axios';

// Backend server base URL
const BASE_URL = 'http://localhost:5000/api'; // Update if deploying backend elsewhere

// Create an Axios instance
const valorantApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch Summoner by Name
export const fetchSummonerByName = async (name, region) => {
  try {
    const response = await valorantApi.get('/summoner', {
      params: { name, region },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching summoner:', error);
    throw error;
  }
};

// Fetch League Entries
export const fetchLeagueEntries = async (encryptedSummonerId, region) => {
  try {
    const response = await valorantApi.get('/league', {
      params: { encryptedSummonerId, region },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching league entries:', error);
    throw error;
  }
};

// Fetch Match Details
export const fetchMatchDetails = async (matchId, region) => {
  try {
    const response = await valorantApi.get('/match', {
      params: { matchId, region },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};

export default valorantApi;
