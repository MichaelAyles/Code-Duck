import { api } from '../config/api';

export interface ExplainRequest {
  code: string;
  language?: string;
  context?: string;
}

export interface ExplainResponse {
  explanation: string;
  suggestions?: string[];
  complexity: 'low' | 'medium' | 'high';
  requestId: string;
  remainingRequests: number;
}

export interface AIRequest {
  id: string;
  type: string;
  createdAt: string;
  tokensUsed: number;
  inputData: any;
}

export interface UsageStats {
  tier: string;
  dailyLimit: number;
  requestsToday: number;
  remainingRequests: number;
}

export const aiService = {
  async explainCode(request: ExplainRequest): Promise<ExplainResponse> {
    const response = await api.post('/api/ai/explain', request);
    return response.data;
  },

  async getHistory(): Promise<AIRequest[]> {
    const response = await api.get('/api/ai/history');
    return response.data.requests;
  },

  async getUsage(): Promise<UsageStats> {
    const response = await api.get('/api/ai/usage');
    return response.data;
  }
};