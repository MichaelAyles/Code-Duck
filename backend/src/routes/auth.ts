import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance) {
  // Register endpoint
  app.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const { email, password, name } = request.body;

    // Validate input
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return reply.code(400).send({ error: 'Password must be at least 8 characters' });
    }

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return reply.code(409).send({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        },
        select: {
          id: true,
          email: true,
          name: true,
          tier: true,
          createdAt: true
        }
      });

      // Generate JWT
      const token = app.jwt.sign({ 
        id: user.id, 
        email: user.email,
        tier: user.tier 
      });

      return reply.send({ 
        user, 
        token 
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Login endpoint
  app.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = app.jwt.sign({ 
        id: user.id, 
        email: user.email,
        tier: user.tier 
      });

      return reply.send({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          createdAt: user.createdAt
        }, 
        token 
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get current user
  app.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      
      const user = await prisma.user.findUnique({
        where: { id: (request.user as any).id },
        select: {
          id: true,
          email: true,
          name: true,
          tier: true,
          createdAt: true,
          _count: {
            select: {
              githubAccounts: true,
              trelloAccounts: true,
              aiRequests: true
            }
          }
        }
      });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return reply.send({ user });
    } catch (error) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}