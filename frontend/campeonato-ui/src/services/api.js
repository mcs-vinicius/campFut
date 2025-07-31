// src/services/api.js
import axios from 'axios';

// Instância pública (para rotas como /ranking, /rounds)
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api'
});

// Instância AUTENTICADA (para rotas de admin)
export const authApi = axios.create({
  baseURL: 'http://127.0.0.1:5000/api'
});

// Interceptor: antes de cada requisição da 'authApi', este código é executado
authApi.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // Anexa o token ao cabeçalho de autorização
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;