import { api } from '../config/api';

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface GitHubAccount {
  id: string;
  username: string;
  connectedAt: string;
}

export const githubService = {
  async getAuthUrl(): Promise<string> {
    const response = await api.get('/api/github/auth');
    return response.data.url;
  },

  async getLoginAuthUrl(): Promise<string> {
    const response = await api.get('/api/github/login-auth');
    return response.data.url;
  },

  async handleLoginCallback(code: string): Promise<{ user: any; token: string }> {
    const response = await api.get(`/api/github/login-callback?code=${code}`);
    return response.data;
  },

  async handleCallback(code: string): Promise<GitHubAccount> {
    const response = await api.get(`/api/github/callback?code=${code}`);
    return response.data.githubAccount;
  },

  async getRepositories(): Promise<GitHubRepo[]> {
    const response = await api.get('/api/github/repos');
    return response.data.repos;
  },

  async getRepositoryContents(owner: string, repo: string, path: string = '') {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/contents/${path}`);
    return response.data.data;
  },

  async getRepositoryIssues(owner: string, repo: string) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/issues`);
    return response.data.issues;
  },

  // Helper to start OAuth flow for account linking
  initiateOAuth() {
    this.getAuthUrl().then(url => {
      window.location.href = url;
    }).catch(error => {
      console.error('Failed to initiate GitHub OAuth:', error);
      alert('Failed to connect to GitHub. Please try again.');
    });
  },

  // Helper to start OAuth flow for login
  initiateLoginOAuth() {
    this.getLoginAuthUrl().then(url => {
      window.location.href = url;
    }).catch(error => {
      console.error('Failed to initiate GitHub login:', error);
      alert('Failed to login with GitHub. Please try again.');
    });
  }
};