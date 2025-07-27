import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { prisma } from '../lib/prisma';

interface GitHubTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}


export async function githubRoutes(app: FastifyInstance) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
  const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/github/callback';

  // GitHub OAuth URL
  app.get('/auth', async (_request, reply) => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo,user:email`;
    return reply.send({ url: authUrl });
  });

  // GitHub OAuth callback
  app.get<{ Querystring: { code: string } }>('/callback', async (request, reply) => {
    const { code } = request.query;

    if (!code) {
      return reply.code(400).send({ error: 'No code provided' });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post<GitHubTokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI
        },
        {
          headers: {
            Accept: 'application/json'
          }
        }
      );

      const { access_token } = tokenResponse.data;

      // Get GitHub user info
      const octokit = new Octokit({ auth: access_token });
      const { data: githubUser } = await octokit.users.getAuthenticated();
      
      // Get primary email if not public
      let email = githubUser.email;
      if (!email) {
        const { data: emails } = await octokit.users.listEmailsForAuthenticatedUser();
        const primaryEmail = emails.find(e => e.primary);
        email = primaryEmail?.email || null;
      }

      // Ensure user is authenticated
      await request.jwtVerify();
      const userId = (request.user as any).id;

      // Check if GitHub account already linked
      const existingGitHub = await prisma.gitHubAccount.findUnique({
        where: { githubId: githubUser.id.toString() }
      });

      if (existingGitHub && existingGitHub.userId !== userId) {
        return reply.code(409).send({ error: 'GitHub account already linked to another user' });
      }

      // Save or update GitHub account
      const githubAccount = await prisma.gitHubAccount.upsert({
        where: { githubId: githubUser.id.toString() },
        update: {
          accessToken: access_token,
          username: githubUser.login,
          updatedAt: new Date()
        },
        create: {
          userId,
          githubId: githubUser.id.toString(),
          username: githubUser.login,
          accessToken: access_token
        }
      });

      return reply.send({ 
        success: true,
        githubAccount: {
          id: githubAccount.id,
          username: githubAccount.username,
          connectedAt: githubAccount.createdAt
        }
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Failed to authenticate with GitHub' });
    }
  });

  // Get user's repositories
  app.get('/repos', async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).id;

      // Get GitHub account
      const githubAccount = await prisma.gitHubAccount.findFirst({
        where: { userId }
      });

      if (!githubAccount) {
        return reply.code(404).send({ error: 'GitHub account not connected' });
      }

      // Get repositories
      const octokit = new Octokit({ auth: githubAccount.accessToken });
      const { data: repos } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      });

      return reply.send({
        repos: repos.map(repo => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          private: repo.private,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at
        }))
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch repositories' });
    }
  });

  // Get repository files
  app.get<{ Params: { owner: string; repo: string; path?: string } }>(
    '/repos/:owner/:repo/contents/:path?',
    async (request, reply) => {
      try {
        await request.jwtVerify();
        const userId = (request.user as any).id;
        const { owner, repo, path = '' } = request.params;

        // Get GitHub account
        const githubAccount = await prisma.gitHubAccount.findFirst({
          where: { userId }
        });

        if (!githubAccount) {
          return reply.code(404).send({ error: 'GitHub account not connected' });
        }

        // Get repository contents
        const octokit = new Octokit({ auth: githubAccount.accessToken });
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path
        });

        return reply.send({ data });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({ error: 'Failed to fetch repository contents' });
      }
    }
  );

  // Get repository issues
  app.get<{ Params: { owner: string; repo: string } }>(
    '/repos/:owner/:repo/issues',
    async (request, reply) => {
      try {
        await request.jwtVerify();
        const userId = (request.user as any).id;
        const { owner, repo } = request.params;

        // Get GitHub account
        const githubAccount = await prisma.gitHubAccount.findFirst({
          where: { userId }
        });

        if (!githubAccount) {
          return reply.code(404).send({ error: 'GitHub account not connected' });
        }

        // Get issues
        const octokit = new Octokit({ auth: githubAccount.accessToken });
        const { data: issues } = await octokit.issues.listForRepo({
          owner,
          repo,
          state: 'open',
          sort: 'updated'
        });

        return reply.send({
          issues: issues.map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: issue.labels,
            assignee: issue.assignee,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at
          }))
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({ error: 'Failed to fetch issues' });
      }
    }
  );
}