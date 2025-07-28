import { api } from '../config/api';

export const testApiConnection = async () => {
  try {
    const response = await api.get('/');
    console.log('API Test Success:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Test Failed:', error);
    return { success: false, error: error };
  }
};

export const testHealthEndpoint = async () => {
  try {
    const response = await api.get('/health');
    console.log('Health Check Success:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Health Check Failed:', error);
    return { success: false, error: error };
  }
};