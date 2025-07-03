
import axios from 'axios';

const API_BASE = 'https://pokeapi.co/api/v2';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export const fetchAllPokemon = async () => {
  try {
    const response = await axios.get(`${API_BASE}/pokemon?limit=1000`);
    return response.data.results;
  } catch (error) {
    console.error('Ошибка загрузки покемонов:', error);
    return [];
  }
};

export const fetchPokemonDetails = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки деталей покемона:', error);
    return null;
  }
};
