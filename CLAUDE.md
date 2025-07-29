# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeDuck is a mobile-first AI coding assistant that allows developers to manage their entire coding workflow from their mobile device. The project consists of a React Native mobile app with a Node.js backend, targeting Android-first deployment with a freemium monetization model.

## Architecture

The codebase is organized into four main directories:
- `/backend/` - Node.js/TypeScript API server using Fastify
- `/webapp/` - Mobile-first React web application (primary frontend)
- `/mobile/` - React Native mobile application (future development)
- `/docs/` - Project documentation and business plan

### Backend Architecture
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: OpenRouter API with Google Gemini 2.5 Flash Lite
- **Key integrations**: GitHub OAuth (fully implemented), Trello (planned)

### Web App Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: CSS Variables with mobile-first responsive design
- **Code Highlighting**: Prism.js for syntax highlighting
- **API Communication**: Axios for backend integration
- **State Management**: React hooks and context

### Mobile Architecture (Future)
- **Framework**: React Native 0.80.2
- **Navigation**: React Navigation (stack + bottom tabs)
- **Storage**: AsyncStorage for auth tokens, react-native-keychain for secure storage
- **API Communication**: Axios for backend integration

## Development Commands

### Backend Development
```bash
cd backend
npm run dev          # Development server with hot reload
npm run build        # TypeScript compilation with Prisma generation
npm run start        # Production server
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio (database GUI)
```

### Web App Development
```bash
cd webapp
npm start            # Development server on port 3000
npm run build        # Production build
npm test             # Run tests
```

### Mobile Development (Future)
```bash
cd mobile
npm run android      # Run on Android device/emulator
npm run ios          # Run on iOS device/simulator
npm run start        # Start Metro bundler
npm run test         # Run Jest tests
npm run lint         # Run ESLint
```

## Database Schema

Key entities in the Prisma schema:
- **User**: Core user accounts with email/password auth and tier system (FREE/PRO)
- **GitHubAccount**: OAuth integration for GitHub access
- **TrelloAccount**: OAuth integration for Trello access
- **AIRequest**: Tracking AI interactions and usage limits

## API Routes

The backend exposes these main route groups:
- `/api/auth/*` - User authentication (register, login, profile)
- `/api/github/*` - GitHub integration endpoints (OAuth, repos, file browsing)
- `/api/ai/*` - AI features (explain code, usage stats, history)
- `/` and `/health` - Health check endpoints

## Current Implementation Status

**Completed:**
- User authentication system with JWT
- Mobile-first React web app with responsive design
- Database schema and migrations
- GitHub OAuth integration (login and repository access)
- GitHub repository browser with file viewer
- Syntax highlighting for 20+ languages
- AI code analysis with OpenRouter/Gemini 2.5 Flash Lite
- Modern UI with hamburger menu navigation
- Single repository selection workflow
- AI chat with code pre-population from file viewer
- Usage tracking and rate limiting

**In Progress:**
- Code editing and commit functionality
- Background job processing with BullMQ
- Trello integration
- RevenueCat subscription integration

## Key Development Notes

- The project currently uses a mobile-first React web app for rapid prototyping
- React Native mobile app is planned for future development
- Implements a freemium model (15 AI requests/day free, $9.99/month Pro)
- Environment configuration examples are in `backend/.env.example`
- All API responses should maintain consistent error handling patterns established in auth routes
- Uses Docker Compose for local development with one-command setup (`npm run dev`)
- OpenRouter API key is required in backend/.env for AI functionality
- GitHub OAuth credentials must be configured in backend/.env for GitHub integration