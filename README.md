# CodeDuck 🦆

A mobile-first AI coding assistant that empowers developers to manage their entire coding workflow—from ideation to commit—directly from their mobile device.

## Overview

CodeDuck leverages AI to accelerate the development process, providing a seamless mobile experience for developers on the go. The app integrates with GitHub and Trello to offer a unified dashboard for managing development tasks, viewing code, and using AI to solve coding challenges.

## Features

### Core Functionality
- **Unified Dashboard**: View GitHub issues and Trello cards in one place
- **GitHub Integration**: Browse repositories, view files with syntax highlighting, manage issues
- **Trello Integration**: View boards, manage cards with drag-and-drop functionality
- **AI-Powered Coding Assistant**: Chat-based interface with commands for code explanation, issue fixes, and code generation

### AI Commands
- `explain file <file_path>`: Get natural language explanations of code
- `propose fix for issue <issue_number>`: AI analyzes issues and proposes patches
- `write code <prompt>`: Generate code from natural language descriptions
- `commit`: Create commits with AI-generated messages
- `create pull request`: Open PRs directly from the app

## Tech Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Key Libraries**:
  - `@react-navigation/native`: Navigation
  - `react-native-keychain`: Secure token storage
  - `react-native-syntax-highlighter`: Code rendering
  - `@revenuecat/react-native-purchases`: Monetization

### Backend
- **Node.js with TypeScript**: API server
- **Fastify**: High-performance web framework
- **PostgreSQL**: Primary database
- **Redis + BullMQ**: Background job processing
- **Key Integrations**:
  - GitHub API via `@octokit/rest`
  - Trello API
  - OpenAI API for AI features

### Infrastructure
- **Docker**: Containerization
- **CI/CD**: GitHub Actions
- **Deployment**: PaaS (Render/Fly.io)

## Monetization

CodeDuck uses a freemium model powered by RevenueCat:

### Free Tier (Hobbyist)
- 1 private GitHub repository
- 1 Trello board
- 15 AI requests per day
- Standard AI model (GPT-3.5-turbo)

### Pro Tier ($9.99/month)
- Unlimited repositories and boards
- 200 AI requests per day
- Premium AI models (GPT-4o)
- Priority access to new features
- Enhanced AI capabilities

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- React Native development environment

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Code-Duck.git
   cd Code-Duck
   ```

2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../mobile
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env files based on .env.example
   cp backend/.env.example backend/.env
   cp mobile/.env.example mobile/.env
   ```

4. Run the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Mobile (in a new terminal)
   cd mobile
   npm run ios  # or npm run android
   ```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built for the hackathon with the goal of winning:
- **Best Vibes Award**: Creating a seamless mobile coding experience
- **HAMM Award**: Well-designed freemium subscription model
- **Grand Prize**: Early launch with demonstrated user adoption