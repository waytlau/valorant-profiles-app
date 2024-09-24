// server/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL = 'https://na1.api.riotgames.com/lol'; // Replace <region> with desired region (e.g., na1, euw1)

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to make requests to Riot API
const riotRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: { ...params, api_key: RIOT_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Route to get summoner by name
app.get('/api/summoner', async (req, res) => {
  const { name, region } = req.query;
  if (!name || !region) {
    return res.status(400).json({ error: 'Missing name or region query parameters.' });
  }
  try {
    const data = await riotRequest(`/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`, { region });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summoner data.' });
  }
});

// Route to get league entries
app.get('/api/league', async (req, res) => {
  const { encryptedSummonerId, region } = req.query;
  if (!encryptedSummonerId || !region) {
    return res.status(400).json({ error: 'Missing encryptedSummonerId or region query parameters.' });
  }
  try {
    const data = await riotRequest(`/league/v4/entries/by-summoner/${encryptedSummonerId}`, { region });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch league data.' });
  }
});

// Route to get match details
app.get('/api/match', async (req, res) => {
  const { matchId, region } = req.query;
  if (!matchId || !region) {
    return res.status(400).json({ error: 'Missing matchId or region query parameters.' });
  }
  try {
    const data = await riotRequest(`/match/v4/matches/${matchId}`, { region });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match data.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
