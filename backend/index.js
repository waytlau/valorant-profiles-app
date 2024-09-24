// backend/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const morgan = require('morgan');

// Middleware to parse JSON requests
app.use(express.json());

// Define a route to fetch PUUID by Riot ID
app.get('/api/get-puuid', async (req, res) => {
  const { gameName, tagLine } = req.query;

  if (!gameName || !tagLine) {
    return res.status(400).json({ error: 'gameName and tagLine are required' });
  }

  try {
    const response = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching PUUID:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
  }
});

// Define a route to fetch summoner data by PUUID
app.get('/api/get-summoner', async (req, res) => {
  const { puuid, region } = req.query;

  if (!puuid || !region) {
    return res.status(400).json({ error: 'puuid and region are required' });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching summoner data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Enable CORS for all routes
app.use(cors());

app.use(morgan('combined'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});