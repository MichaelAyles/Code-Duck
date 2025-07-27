# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeDuck is a mobile-first AI coding assistant that enables developers to manage their entire coding workflow from their mobile device. It's built with an Android-first approach using React Native for the mobile app and Node.js/TypeScript for the backend.

## Architecture

The project follows a microservices architecture with these key components:

- **Mobile App**: React Native (Android-first) located in `/mobile`
- **Backend API**: Node.js/Fastify/TypeScript located in `/backend`
- **Database**: PostgreSQL (managed by Prisma ORM)
- **Queue System**: Redis + BullMQ for background jobs
- **Deployment**: Railway platform with auto-deploy from GitHub

## Development Commands

### Backend Development
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Start development server with nodemon
npm run build       # Compile TypeScript to JavaScript
npm start           # Run production server
npm run lint        # Run ESLint (when configured)
npm run typecheck   # Run TypeScript type checking (tsc --noEmit)
npm test            # Run tests (when configured)
```

### Mobile Development
```bash
cd mobile
npm install                    # Install dependencies
npx react-native run-android   # Run on Android device/emulator
npx react-native run-ios       # Run on iOS (when supported)
npm run lint                   # Run ESLint (when configured)
npm test                       # Run tests (when configured)
```

### Database Commands
```bash
cd backend
npx prisma migrate dev    # Create/apply migrations in development
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open database GUI
npx prisma migrate deploy # Apply migrations in production
```

### Deployment
```bash
railway login          # Login to Railway CLI
railway up            # Deploy current directory to Railway
railway logs          # View deployment logs
railway rollback      # Rollback to previous deployment
railway shell         # SSH into deployment
```

## Key Integration Points

### GitHub Integration
- OAuth flow implemented at `/auth/github/*`
- Repository access via `@octokit/rest` client
- Token storage handled securely on backend

### Trello Integration
- OAuth flow at `/auth/trello/*`
- Board/card management via Trello API client

### AI Features
- All AI requests queued via BullMQ to prevent timeouts
- Commands processed in `/ai/*` endpoints
- Support for multiple AI providers (OpenAI, Google AI)

### Monetization
- RevenueCat integration for subscription management
- Free tier: 1 repo, 1 board, 15 AI requests/day
- Pro tier ($9.99/mo): Unlimited access, 200 AI requests/day

## Development Philosophy

1. **Deploy First**: Every feature is built on production from day one
2. **Android First**: Focus on Android for faster iteration without Apple's review process
3. **Queue Heavy Tasks**: All AI operations run as background jobs
4. **Type Safety**: Use TypeScript throughout with strict mode
5. **API First**: Backend provides RESTful API consumed by mobile app

## Important Notes

- The project uses a "deploy first, build live" approach - no local-only development
- All environment variables are managed through Railway's dashboard
- Authentication tokens are never stored on the mobile client
- AI requests are rate-limited based on subscription tier
- The codebase is prepared for iOS but launches Android-first