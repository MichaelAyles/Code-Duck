# CodeDuck Development Guide

## 🚀 Development Philosophy

### Local-First
- Everything runs on your machine via Docker
- No cloud dependencies for development
- Full control over your environment

### Mobile-First Web
- React web app optimized for mobile screens
- Instant feedback with hot reload
- Easy migration path to React Native

### Rapid Prototyping
- One command to start everything
- No build times or compilation waits
- See changes instantly in browser

## 🛠️ Tech Stack Details

### Backend (Port 4000/4001)
```
backend/
├── src/
│   ├── routes/         # API endpoints
│   │   ├── auth.ts    # Authentication routes
│   │   └── github.ts  # GitHub integration
│   ├── lib/           # Shared utilities
│   │   └── prisma.ts  # Database client
│   └── index.ts       # Server entry point
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── migrations/    # Database migrations
└── Dockerfile         # Container configuration
```

**Key Technologies:**
- **Fastify**: High-performance web framework
- **Prisma**: Type-safe ORM with migrations
- **TypeScript**: Type safety and better DX
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

### Frontend (Port 3002)
```
webapp/
├── src/
│   ├── components/    # React components
│   ├── services/      # API services
│   ├── styles/        # Mobile-first CSS
│   ├── config/        # Configuration
│   └── types/         # TypeScript types
├── scripts/           # Development utilities
└── public/           # Static assets
```

**Key Technologies:**
- **React 19**: Latest React with TypeScript
- **Axios**: HTTP client with interceptors
- **Mobile-First CSS**: Touch-optimized styles

### Infrastructure
```
docker-compose.yml     # Service definitions
├── backend           # Node.js API
├── postgres          # PostgreSQL database
└── redis            # Cache and queues
```

## 📝 Common Development Tasks

### Adding a New API Endpoint

1. **Create route file** in `backend/src/routes/`
```typescript
// backend/src/routes/ai.ts
import { FastifyInstance } from 'fastify';

export const aiRoutes = async (app: FastifyInstance) => {
  app.post('/explain', async (request, reply) => {
    // Your endpoint logic
  });
};
```

2. **Register route** in `backend/src/index.ts`
```typescript
app.register(aiRoutes, { prefix: '/api/ai' });
```

3. **Test with curl**
```bash
curl -X POST http://localhost:4001/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{"code": "function hello() {}"}'
```

### Adding a New Frontend Component

1. **Create component** in `webapp/src/components/`
```typescript
// webapp/src/components/CodeViewer.tsx
export const CodeViewer: React.FC<Props> = ({ code }) => {
  return <pre className="code-viewer">{code}</pre>;
};
```

2. **Add styles** in `webapp/src/styles/mobile.css`
```css
.code-viewer {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}
```

### Database Changes

1. **Update schema** in `backend/prisma/schema.prisma`
```prisma
model AIRequest {
  id        String   @id @default(cuid())
  userId    String
  prompt    String
  response  String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

2. **Create migration**
```bash
cd backend
npx prisma migrate dev --name add_ai_requests
```

3. **Generate client**
```bash
npx prisma generate
```

## 🔍 Debugging

### Backend Logs
```bash
# View all backend logs
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend
```

### Frontend Debugging
- Open Chrome DevTools (F12)
- Check Network tab for API calls
- Check Console for errors
- React Developer Tools extension

### Database Inspection
```bash
# Open Prisma Studio
cd backend
npx prisma studio

# Direct PostgreSQL access
docker-compose exec postgres psql -U user -d codeduck
```

## 🚨 Common Issues

### Port Already in Use
```bash
# Find what's using port 4001
lsof -i :4001

# Kill the process
kill -9 <PID>
```

### Docker Issues
```bash
# Reset everything
docker-compose down -v
docker-compose up --build

# Clean Docker system
docker system prune -a
```

### Frontend Can't Connect to Backend
1. Check backend is running: `docker-compose ps`
2. Check your IP in `.env` file
3. Try `http://localhost:4001` instead
4. Check browser console for CORS errors

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@postgres:5432/codeduck"
JWT_SECRET="your-secret-key-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
OPENAI_API_KEY="your-openai-key"
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://100.79.131.40:4001
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

## 📚 Useful Commands

```bash
# Start everything
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Install all dependencies
npm run install:all

# Run backend migrations
cd backend && npx prisma migrate dev

# Open database GUI
cd backend && npx prisma studio

# Format code
cd webapp && npm run format
cd backend && npm run format

# Check types
cd webapp && npm run type-check
cd backend && npm run type-check
```

## 🎯 Best Practices

1. **Always test API changes** with the frontend
2. **Use TypeScript** for type safety
3. **Follow mobile-first design** principles
4. **Keep components small** and focused
5. **Use meaningful commit messages**
6. **Test on actual mobile devices** when possible
7. **Handle errors gracefully** in the UI
8. **Add loading states** for better UX

## 🔗 Resources

- [Fastify Documentation](https://www.fastify.io/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)