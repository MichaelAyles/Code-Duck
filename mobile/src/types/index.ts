export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'FREE' | 'PRO';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  language?: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: string;
  labels: any[];
  assignee?: any;
  createdAt: string;
  updatedAt: string;
}