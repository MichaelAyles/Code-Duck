# CodeDuck Development TODO

## 🏗️ Development Approach
- **Local-First**: Everything runs via Docker on your machine
- **Mobile-First Web**: React web app for rapid prototyping
- **One Command**: `npm run dev` starts everything

## ✅ Completed
- [x] Docker Compose setup (PostgreSQL, Redis, Backend)
- [x] Backend API with Fastify and TypeScript
- [x] Database schema with Prisma ORM
- [x] Authentication endpoints (register/login)
- [x] Mobile-first React web app
- [x] API connection with auto-detection
- [x] One-command development (`npm run dev`)
- [x] Documentation updated for local-first approach

## 🔄 In Progress
- [ ] Frontend authentication flow
  - [ ] Login screen UI
  - [ ] Registration screen UI
  - [ ] Token management
  - [ ] Protected routes

## 📋 Next Up

### High Priority
1. **GitHub OAuth Integration**
   - [ ] Create GitHub OAuth App
   - [ ] Add OAuth callback endpoint
   - [ ] Frontend OAuth flow
   - [ ] Store GitHub tokens securely

2. **First AI Feature**
   - [ ] Set up OpenAI/Google AI account
   - [ ] Create `/api/ai/explain` endpoint
   - [ ] Add AI chat UI component
   - [ ] Implement code explanation feature

3. **Core Mobile Screens**
   - [ ] Repository list screen
   - [ ] File browser component
   - [ ] Code viewer with syntax highlighting
   - [ ] AI chat interface

### Medium Priority
- [ ] Trello integration
- [ ] Usage tracking and limits
- [ ] Pro tier features
- [ ] Error handling improvements

### Low Priority
- [ ] React Native migration
- [ ] RevenueCat integration
- [ ] Production deployment
- [ ] Analytics setup

## 🔧 Technical Debt
- [ ] Add comprehensive error handling
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Add unit tests for backend
- [ ] Add integration tests
- [ ] Set up CI/CD pipeline

## 📝 Notes
- Using mock data for user stats until auth is fully integrated
- Backend runs on port 4000, frontend on port 3002
- All API calls go through http://100.79.131.40:4001
- Frontend automatically detects if backend is running