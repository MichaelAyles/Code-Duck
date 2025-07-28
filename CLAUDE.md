# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeDuck is a mobile-first AI coding assistant that allows developers to manage their entire coding workflow from their mobile device. The project consists of a React Native mobile app with a Node.js backend, targeting Android-first deployment with a freemium monetization model.

## Architecture

The codebase is organized into three main directories:
- `/backend/` - Node.js/TypeScript API server using Fastify
- `/mobile/` - React Native mobile application
- `/docs/` - Project documentation and business plan

### Backend Architecture
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Key integrations**: GitHub OAuth (via @octokit/rest), planned Trello integration

### Mobile Architecture
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

### Mobile Development
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
- `/api/github/*` - GitHub integration endpoints
- `/` and `/health` - Health check endpoints

## Current Implementation Status

**Completed:**
- User authentication system with JWT
- Basic React Native app structure with navigation
- Database schema and migrations
- GitHub OAuth preparation

**In Progress:**
- AI chat interface (placeholder screens exist)
- GitHub repository browsing
- Trello integration
- Background job processing with BullMQ
- RevenueCat subscription integration

## Key Development Notes

- The project follows an Android-first strategy for faster deployment
- Implements a freemium model (15 AI requests/day free, $9.99/month Pro)
- Environment configuration examples are in `backend/.env.example`
- All API responses should maintain consistent error handling patterns established in auth routes
- Mobile screens use a consistent navigation structure with proper TypeScript typing