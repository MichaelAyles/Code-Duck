# CodeDuck Local Development Setup

## Overview
CodeDuck uses a local-first development approach with Docker for services and a mobile-first React web app for rapid prototyping.

## Prerequisites
- Node.js 18+ installed
- Docker & Docker Compose installed
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/Code-Duck.git
cd Code-Duck

# Install dependencies
npm install
npm run install:all

# Start everything with one command
npm run dev
```

That's it! The script will:
1. Check if backend is running
2. Start Docker services if needed
3. Launch the frontend
4. Display clickable URLs

### 1. Start Backend Services
```bash
# In project root
docker-compose up --build

# Backend will be available at:
# - http://localhost:4001 (host)
# - http://100.79.131.40:4001 (external IP)
```

### 2. Start Mobile App
```bash
# Navigate to mobile directory
cd mobile

# Start Metro bundler
npm start

# In another terminal (also in mobile directory):
cd mobile
npm run android  # Runs on Android device/emulator
```

### 3. Test API Connection
The mobile app will automatically test the backend connection and display:
- ✅ Backend Connected - CodeDuck API v1 (if successful)
- ❌ Backend Connection Failed (if connection issues)

## Mobile Development URLs

### For Android Emulator:
- API URL: `http://10.0.2.2:4001`

### For Physical Android Device:
- API URL: `http://100.79.131.40:4001`
- Make sure your device is on the same WiFi network

### For External Testing:
```bash
# Use ngrok for external access
npx ngrok http 4001
# Then update .env with the ngrok URL
```

## Current Features
- Backend API with authentication routes
- Mobile app with navigation structure
- Dashboard screen with API connection test
- Mock user data for testing

## Next Steps
1. ✅ Test mobile app connects to backend 
2. 🔄 Implement authentication integration
3. 📝 Add GitHub OAuth
4. 🤖 Create first AI feature

## Troubleshooting

### Backend Issues:
```bash
# Check if containers are running
docker-compose ps

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Mobile Issues:
```bash
# Clear Metro cache
npm start -- --reset-cache

# Check connected devices
adb devices

# View Android logs
npx react-native log-android
```

### Network Issues:
```bash
# Test backend from command line
curl http://localhost:4001
curl http://100.79.131.40:4001

# Test from mobile device browser
# Open http://100.79.131.40:4001 in mobile browser
```