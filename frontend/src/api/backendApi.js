import axios from 'axios';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🔐 АВТОРИЗАЦИЯ
export const registerUser = async (data) => {
  return axios.post(`${API}/auth/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API}/auth/login`, data);
};

// 🃏 КАРТОЧКИ
export const getAllCards = async () => {
  return axios.get(`${API}/cards`);
};

export const addCardToCollection = async (cardData, token) => {
  return axios.post(`${API}/collection`, cardData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUserCollection = async (token) => {
  return axios.get(`${API}/collection`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 🤝 ТРЕЙДЫ
export const proposeTrade = async (tradeData, token) => {
  return axios.post(`${API}/trades`, tradeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUserTrades = async (token) => {
  return axios.get(`${API}/trades`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 🏆 АУКЦИОНЫ
export const createAuction = async (auctionData, token) => {
  return axios.post(`${API}/auctions`, auctionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getAllAuctions = async () => {
  return axios.get(`${API}/auctions`);
};

// 👤 ПРОФИЛЬ
export const getUserProfile = async (token) => {
  return axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
