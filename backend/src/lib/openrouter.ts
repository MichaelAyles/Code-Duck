import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_AI_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash-lite';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private apiKey: string;

  constructor() {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_AI_API_KEY environment variable is required');
    }
    this.apiKey = OPENROUTER_API_KEY;
  }

  async explainCode(code: string, language: string = 'unknown', context?: string): Promise<{
    explanation: string;
    suggestions?: string[];
    complexity: 'low' | 'medium' | 'high';
    tokensUsed: number;
  }> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are an expert code analyst and software engineer. Your task is to analyze code and provide clear, helpful explanations.

When analyzing code, please:
1. Explain what the code does in plain English
2. Identify the main purpose and functionality
3. Point out any notable patterns, algorithms, or design choices
4. Assess the complexity level (low/medium/high)
5. Provide 2-3 practical suggestions for improvement if applicable

Format your response as JSON with this structure:
{
  "explanation": "Clear explanation of what the code does",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "complexity": "low|medium|high"
}

Keep explanations concise but informative. Focus on helping developers understand and improve the code.`
      },
      {
        role: 'user',
        content: `Please analyze this ${language} code${context ? ` (${context})` : ''}:

\`\`\`${language}
${code}
\`\`\`

Provide a clear explanation, assess complexity, and suggest improvements if applicable.`
      }
    ];

    try {
      const response = await axios.post<OpenRouterResponse>(
        OPENROUTER_API_URL,
        {
          model: MODEL,
          messages,
          temperature: 0.3,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-Title': 'CodeDuck AI Code Analyzer'
          }
        }
      );

      const aiResponse = response.data.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI service');
      }

      // Try to parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch (parseError) {
        // Fallback if AI doesn't return valid JSON
        return {
          explanation: aiResponse,
          complexity: this.estimateComplexity(code),
          tokensUsed: response.data.usage?.total_tokens || 0
        };
      }

      return {
        explanation: parsedResponse.explanation || aiResponse,
        suggestions: parsedResponse.suggestions && Array.isArray(parsedResponse.suggestions) 
          ? parsedResponse.suggestions.slice(0, 3) // Limit to 3 suggestions
          : undefined,
        complexity: this.validateComplexity(parsedResponse.complexity) || this.estimateComplexity(code),
        tokensUsed: response.data.usage?.total_tokens || 0
      };

    } catch (error: any) {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      
      // Fallback to basic analysis if API fails
      if (error.response?.status === 429) {
        throw new Error('AI service rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('AI service authentication failed. Please check API key.');
      } else {
        throw new Error('AI service temporarily unavailable. Please try again.');
      }
    }
  }

  private estimateComplexity(code: string): 'low' | 'medium' | 'high' {
    const lines = code.split('\n').length;
    const hasLoops = /for|while|forEach/.test(code);
    const hasFunctions = /function|def|=>|class/.test(code);
    const hasConditionals = /if|switch|case/.test(code);
    const hasNestedStructures = code.split('{').length > 3;

    if (lines > 50 || (hasLoops && hasFunctions && hasConditionals && hasNestedStructures)) {
      return 'high';
    } else if (lines > 20 || (hasLoops && hasFunctions)) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private validateComplexity(complexity: any): 'low' | 'medium' | 'high' | null {
    if (['low', 'medium', 'high'].includes(complexity)) {
      return complexity as 'low' | 'medium' | 'high';
    }
    return null;
  }
}

export const openRouterService = new OpenRouterService();