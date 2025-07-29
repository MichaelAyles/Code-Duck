import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { openRouterService } from '../lib/openrouter';

interface ExplainRequest {
  code: string;
  language?: string;
  context?: string;
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

      // Use OpenRouter AI service for real code analysis
      app.log.info(`Processing AI request for ${language} code (${code.length} chars)`);
      const explanation = await openRouterService.explainCode(code, language, context);
      
      // Log the AI request
      const aiRequest = await prisma.aIRequest.create({
        data: {
          userId,
          type: 'explain',
          inputData: { code, language, context },
          outputData: explanation as any,
          tokensUsed: explanation.tokensUsed,
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

