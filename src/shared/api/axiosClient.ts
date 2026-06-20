import axios from 'axios';

// Default to LocalStack's standard edge port if no .env variable is configured yet
const API_BASE_URL = 'http://localhost:4566/_aws/execute-api';
const API_GATEWAY_ID = 'qfauuytct8';
const STAGE = 'prod';

const BASE_URL = /*import.meta.env.VITE_API_BASE_URL ||*/ `${API_BASE_URL}/${API_GATEWAY_ID}/${STAGE}`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10-second request fail protection
});

// Response interceptor for unified error tracking across your restaurant features
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 Yummizi API Error Network Layer:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);