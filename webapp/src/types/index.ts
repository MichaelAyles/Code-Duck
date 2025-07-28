export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'FREE' | 'PRO';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}