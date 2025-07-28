import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

interface ExplainRequest {
  code: string;
  language?: string;
  context?: string;
}

interface ExplainResponse {
  explanation: string;
  suggestions?: string[];
  complexity: 'low' | 'medium' | 'high';
  requestId: string;
}

export async function aiRoutes(app: FastifyInstance) {
  
  // AI Explain Code endpoint
  app.post<{ Body: ExplainRequest }>('/explain', async (request, reply) => {
    try {
      // Verify authentication
      await request.jwtVerify();
      const userId = (request.user as any).id;

      // Get user to check tier and limits
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              aiRequests: {
                where: {
                  createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Check daily limits
      const dailyLimit = user.tier === 'PRO' ? 200 : 15;
      const requestsToday = user._count.aiRequests;

      if (requestsToday >= dailyLimit) {
        return reply.code(429).send({ 
          error: 'Daily AI request limit exceeded',
          limit: dailyLimit,
          used: requestsToday
        });
      }

      const { code, language = 'unknown', context } = request.body;

      if (!code || code.trim().length === 0) {
        return reply.code(400).send({ error: 'Code is required' });
      }

      if (code.length > 10000) {
        return reply.code(400).send({ error: 'Code too long (max 10,000 characters)' });
      }

      // For now, use a mock AI response (replace with actual AI service later)
      const explanation = await generateMockExplanation(code, language, context);
      
      // Log the AI request
      const aiRequest = await prisma.aIRequest.create({
        data: {
          userId,
          type: 'explain',
          inputData: { code, language, context },
          outputData: explanation as any,
          tokensUsed: Math.floor(code.length / 4), // Rough estimate
        }
      });

      return reply.send({
        ...explanation,
        requestId: aiRequest.id,
        remainingRequests: dailyLimit - requestsToday - 1
      });

    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Failed to process AI request' });
    }
  });

  // Get AI request history
  app.get('/history', async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).id;

      const requests = await prisma.aIRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          type: true,
          createdAt: true,
          tokensUsed: true,
          inputData: true
        }
      });

      return reply.send({ requests });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch AI history' });
    }
  });

  // Get usage stats
  app.get('/usage', async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              aiRequests: {
                where: {
                  createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const dailyLimit = user.tier === 'PRO' ? 200 : 15;
      const requestsToday = user._count.aiRequests;

      return reply.send({
        tier: user.tier,
        dailyLimit,
        requestsToday,
        remainingRequests: Math.max(0, dailyLimit - requestsToday)
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch usage stats' });
    }
  });
}

// Mock AI explanation generator (replace with actual AI service)
async function generateMockExplanation(code: string, language: string, context?: string): Promise<ExplainResponse> {
  // Simple analysis for demo purposes
  const lines = code.split('\n').length;
  const hasLoops = /for|while|forEach/.test(code);
  const hasFunctions = /function|def|=>/.test(code);
  const hasConditionals = /if|switch|case/.test(code);
  
  let complexity: 'low' | 'medium' | 'high' = 'low';
  if (lines > 20 || (hasLoops && hasFunctions)) complexity = 'medium';
  if (lines > 50 || (hasLoops && hasFunctions && hasConditionals)) complexity = 'high';

  const suggestions = [];
  if (!hasFunctions && lines > 10) suggestions.push('Consider breaking this into smaller functions');
  if (hasLoops && !code.includes('const') && !code.includes('let')) suggestions.push('Consider using const/let for better variable scoping');
  if (language === 'javascript' && !code.includes('//')) suggestions.push('Add comments to explain complex logic');

  const explanation = `This ${language} code snippet contains ${lines} lines. ` +
    `${hasFunctions ? 'It defines functions which help organize the code. ' : ''}` +
    `${hasLoops ? 'It uses loops for iteration. ' : ''}` +
    `${hasConditionals ? 'It includes conditional logic for decision making. ' : ''}` +
    `The code complexity is ${complexity}. ` +
    `${context ? `Given the context: ${context}, this code appears to be part of a larger system. ` : ''}` +
    `Overall, this is a ${complexity === 'low' ? 'straightforward' : complexity === 'medium' ? 'moderately complex' : 'complex'} piece of code.`;

  return {
    explanation,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    complexity,
    requestId: '' // Will be set by caller
  };
}