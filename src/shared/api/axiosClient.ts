import { authService } from '@/features/auth/api/authService';
import axios from 'axios';

// Default to LocalStack's standard edge port if no .env variable is configured yet
const API_BASE_URL = 'http://localhost:4566/_aws/execute-api';
const API_GATEWAY_ID = 'sn4thj6vo3';
const STAGE = 'prod';

const BASE_URL = /*import.meta.env.VITE_API_BASE_URL ||*/ `${API_BASE_URL}/${API_GATEWAY_ID}/${STAGE}`;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10-second request fail protection
});

// 1. REQUEST INTERCEPTOR: Inject Bearer Token into outgoing calls
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await authService.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error tracking across your restaurant features
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 Yummizi API Error Network Layer:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);