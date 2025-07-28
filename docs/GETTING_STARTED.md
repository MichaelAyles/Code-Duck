# CodeDuck - Getting Started Guide

## Philosophy: Deploy First, Build Live
Every feature is built on production from day one. No local-only development that "works on my machine."

## Day 1: Accounts & Infrastructure (2-3 hours)

### 1. Create Accounts (30 min)
```bash
# Required immediately:
[ ] Render account (railway.app) - Connect GitHub
[ ] GitHub account (if needed)
[ ] Google account for AI services

# Required soon:
[ ] Google Play Console ($25) 
[ ] OpenAI/Google AI Studio account
[ ] SendGrid/Resend (email service)

# Can wait a few days:
[ ] RevenueCat account
[ ] Sentry account (error tracking)
```

### 2. Create GitHub Repository (5 min)
```bash
# Create new repo "code-duck" on GitHub
# Clone locally:
git clone https://github.com/YOUR_USERNAME/code-duck.git
cd code-duck
```

### 3. Initialize Backend (30 min)
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y
npm install fastify @fastify/cors dotenv
npm install -D typescript @types/node nodemon ts-node

# Create basic server (src/index.ts):
echo 'import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });
app.register(cors);

app.get("/", async () => ({ 
  status: "live",
  message: "CodeDuck API v1" 
}));

const start = async () => {
  try {
    await app.listen({ 
      port: parseInt(process.env.PORT || "3000"),
      host: "0.0.0.0"
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();' > src/index.ts

# Create package.json scripts
# Add to package.json:
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### 4. Deploy to Render IMMEDIATELY (20 min)

```bash
# No CLI needed! Render deploys directly from your `render.yaml` file.
# 1. Create a Render account (render.com) and connect your GitHub.
# 2. Create a new "Blueprint" and select your repository.
# 3. Render will automatically detect and deploy your services based on `render.yaml`.

# Get your live URL from the Render dashboard.
# Your API will be live at: https://your-app-name.onrender.com
```

### 5. Verify Deployment (5 min)
```bash
# Test your live API
curl https://your-app.up.railway.app
# Should return: {"status":"live","message":"CodeDuck API v1"}
```

## Day 2: Mobile App Foundation (3-4 hours)

### 1. Initialize React Native (1 hour)
```bash
cd .. # Back to project root
npx react-native init CodeDuckMobile --template react-native-template-typescript
cd CodeDuckMobile

# Test on Android device/emulator
npx react-native run-android
```

### 2. Connect to Live Backend (30 min)
```bash
# Install dependencies
npm install axios react-native-config

# Create .env file
echo "API_URL=https://your-app.up.railway.app" > .env

# Create API service (src/services/api.ts)
# Test connection to your LIVE backend
```

### 3. Set Up Auto-Deploy (30 min)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/deploy-action@v1
        with:
          service: backend
          token: ${{ secrets.RAILWAY_TOKEN }}
```

## Day 3-5: Core Features (While Live!)

### Phase 1: Authentication (Day 3)
1. Add Prisma to backend (deploy after each step!)
2. Create user model
3. Add /auth/register endpoint
4. Add /auth/login endpoint
5. Test with Postman against LIVE API
6. Add auth screens to mobile app

### Phase 2: GitHub Integration (Day 4)
1. Create GitHub OAuth app
2. Add OAuth endpoints to backend
3. Deploy and test OAuth flow
4. Add GitHub login to mobile
5. Create /github/repos endpoint
6. Add repo list screen

### Phase 3: First AI Feature (Day 5)
1. Add AI provider credentials to Render
2. Create /ai/explain endpoint
3. Add file viewer to mobile
4. Connect explain feature
5. Test end-to-end on LIVE system

## Week 2: Polish & Launch

### MVP Checklist
- [ ] 3 working AI features
- [ ] Clean UI with loading states
- [ ] Error handling everywhere
- [ ] RevenueCat paywall
- [ ] Demo video recorded
- [ ] App store listing ready

## Pro Tips

1. **Every commit deploys** - Keep main branch stable
2. **Test on production** - Your local env doesn't matter
3. **Mobile logs** - Use Flipper for debugging
4. **Quick iteration** - Deploy 10+ times per day
5. **User feedback** - Share Render URL for testing

## Emergency Fixes

```bash
# Rollback bad deploy
railway rollback

# Check logs
railway logs

# SSH to debug
railway shell
```

Remember: If it's not deployed, it doesn't exist!