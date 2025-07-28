# CodeDuck 🦆

A mobile-first AI coding assistant that empowers developers to manage their entire coding workflow—from ideation to commit—directly from their mobile device.

## 🚀 Quick Start

```bash
# Clone and start everything with one command
git clone https://github.com/yourusername/Code-Duck.git
cd Code-Duck
npm run dev
```

That's it! Backend and frontend will start automatically.
- 📱 Frontend: http://100.79.131.40:3002 (clickable in terminal)
- 🔌 Backend API: http://localhost:4001

## Overview

CodeDuck leverages AI to accelerate the development process, providing a seamless mobile experience for developers on the go. Built with a **local-first, rapid prototyping** approach using Docker and a mobile-optimized React web app.

## 🏗️ Architecture

### Development Philosophy
- **Local-First**: Everything runs on your machine via Docker
- **Mobile-First Web**: React web app optimized for mobile, easily portable to React Native
- **One Command Setup**: `npm run dev` starts everything
- **Fast Iteration**: Hot reload, no build times, instant feedback

### Tech Stack

**Frontend (Mobile Web App)**
- **React with TypeScript**: Mobile-first responsive web app
- **Axios**: API communication
- **Mobile-Optimized CSS**: Touch-friendly, native app feel

**Backend**
- **Node.js with TypeScript**: API server on port 4000
- **Fastify**: High-performance web framework
- **PostgreSQL**: Database (via Docker)
- **Redis**: Caching and job queues (via Docker)
- **Prisma**: Type-safe ORM

**Infrastructure**
- **Docker Compose**: One-command local development
- **Automatic Backend Detection**: Frontend checks if backend is running
- **Smart Scripts**: `npm run dev` handles everything

## 📁 Project Structure

```
Code-Duck/
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── lib/          # Shared utilities
│   │   └── index.ts      # Server entry point
│   ├── prisma/           # Database schema
│   └── Dockerfile        # Container config
├── webapp/               # Mobile-first React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── styles/       # Mobile-first CSS
│   └── scripts/          # Dev utilities
├── mobile/               # React Native (future)
├── docker-compose.yml    # Local services
└── package.json         # Root scripts
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/Code-Duck.git
   cd Code-Duck
   npm install          # Root dependencies
   npm run install:all  # Backend + webapp dependencies
   ```

2. **Start Development**
   ```bash
   npm run dev  # Starts backend (if needed) + frontend
   ```

### Available Commands

From project root:
- `npm run dev` - Start everything (checks backend first)
- `npm run dev:backend` - Start only backend services
- `npm run dev:frontend` - Start only frontend
- `npm run dev:force` - Skip backend check

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### GitHub Integration
- `GET /api/github/repos` - List user repositories
- `GET /api/github/issues` - Get repository issues

### AI Features (Coming Soon)
- `POST /api/ai/explain` - Explain code
- `POST /api/ai/fix` - Propose fixes
- `POST /api/ai/generate` - Generate code

## 💰 Monetization

CodeDuck uses a freemium model:

### Free Tier
- 1 private GitHub repository
- 15 AI requests per day
- Basic AI model (Gemini Flash)

### Pro Tier ($9.99/month)
- Unlimited repositories
- 200 AI requests per day
- Premium AI models (GPT-4o)
- Priority features

## 🚧 Current Status

✅ **Completed**
- Docker-based local development
- Mobile-first React web app
- Backend API structure
- Authentication endpoints
- Auto-start development environment

🔄 **In Progress**
- Frontend authentication flow
- GitHub OAuth integration
- AI feature implementation

📋 **Planned**
- Trello integration
- RevenueCat subscriptions
- React Native port
- Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Goals

Built for winning:
- **Best Vibes Award**: Seamless mobile coding experience
- **HAMM Award**: Well-designed freemium model
- **Grand Prize**: Rapid development and user adoption