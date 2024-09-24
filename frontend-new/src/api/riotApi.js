// src/api/riotApi.js
import axios from 'axios';

export const fetchPUUIDByRiotID = async (gameName, tagLine) => {
  try {
    const response = await axios.get(
      `/api/get-puuid?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
    );
    return response.data.puuid;
  } catch (error) {
    console.error('Error fetching PUUID:', error.response?.data || error.message);
    throw error;
  }
};


export const fetchSummonerByPUUID = async (puuid, region) => {
  try {
    const response = await axios.get(
      `/api/get-summoner?puuid=${encodeURIComponent(puuid)}&region=${region}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching summoner data:', error.response?.data || error.message);
    throw error;
  }
};

