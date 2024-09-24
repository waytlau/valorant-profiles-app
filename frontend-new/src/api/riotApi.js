// frontend-new/src/api/riotApi.js
import axios from 'axios';
import { mockSummonerData } from './mockSummonerData'; // Ensure this path is correct

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to fetch summoner data by name and tagline
export const fetchSummonerByName = async (summonerNameWithTagline, region) => {
  try {
    if (import.meta.env.DEV) {
      // Return mock data during development
      return mockSummonerData;
    }

    // Split the summoner name and tagline
    const [summonerName, tagline] = summonerNameWithTagline.split('#');
    
    if (!summonerName || !tagline) {
      throw new Error('Summoner name must include a tagline (e.g., PlayerName#1234).');
    }

    // URL encode the summoner name and tagline
    const encodedName = encodeURIComponent(summonerName);
    const encodedTagline = encodeURIComponent(tagline);

    // Construct the API endpoint
    const endpoint = `${API_BASE_URL}/valorant/summoner/v1/summoners/by-name/${encodedName}/tag/${encodedTagline}`;

    // Make the API request
    const response = await axios.get(endpoint, {
      headers: {
        'X-Riot-Token': import.meta.env.VITE_RIOT_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching summoner data:', error.response || error);
    throw error;
  }
};

// Mock function to fetch league entries
export const fetchLeagueEntries = async (playerId, region) => {
  try {
    if (import.meta.env.DEV) {
      // Return mock data during development
      return [
        {
          leagueId: 'league123',
          queueType: 'Ranked',
          tier: 'Gold',
          rank: 'IV',
          leaguePoints: 50,
          wins: 10,
          losses: 5,
        },
        // Add more mock league entries as needed
      ];
    }

    // Implement actual API call if not in development
    // Replace with the correct endpoint and logic
    const endpoint = `${API_BASE_URL}/valorant/league/v1/entries/${playerId}`;
    const response = await axios.get(endpoint, {
      headers: {
        'X-Riot-Token': import.meta.env.VITE_RIOT_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching league entries:', error.response || error);
    throw error;
  }
};

// Mock function to fetch match details
export const fetchMatchDetails = async (matchId, region) => {
  try {
    if (import.meta.env.DEV) {
      // Return mock data during development
      return {
        matchId: matchId,
        players: [
          {
            puuid: 'playerPUUID1',
            team: 'Blue',
            character: 'Jett',
            kills: 15,
            deaths: 10,
            assists: 5,
            // ...other stats
          },
          {
            puuid: 'playerPUUID2',
            team: 'Red',
            character: 'Phoenix',
            kills: 8,
            deaths: 12,
            assists: 7,
            // ...other stats
          },
          // ...other players
        ],
        map: 'Bind',
        duration: '35m20s',
        // ...other match details
      };
    }

    // Implement actual API call if not in development
    // Replace with the correct endpoint and logic
    const endpoint = `${API_BASE_URL}/valorant/match/v1/matches/${matchId}`;
    const response = await axios.get(endpoint, {
      headers: {
        'X-Riot-Token': import.meta.env.VITE_RIOT_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error.response || error);
    throw error;
  }
};
