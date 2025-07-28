import { api } from '../config/api';
import { User, AuthResponse } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  saveAuthData(authResponse: AuthResponse) {
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  },

  getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};