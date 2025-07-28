import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use different URLs for physical device vs emulator
const getApiUrl = () => {
  if (__DEV__) {
    // For Android emulator, use 10.0.2.2 to reach host
    if (Platform.OS === 'android') {
      return process.env.API_URL_EMULATOR || 'http://10.0.2.2:4001';
    }
    // For physical devices, use the actual IP
    return process.env.API_URL || 'http://100.79.131.40:4001';
  }
  return process.env.API_URL || '';
};

export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API URL:', getApiUrl());

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // TODO: Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default api;