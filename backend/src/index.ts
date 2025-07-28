import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { githubRoutes } from "./routes/github";

dotenv.config();

const app = Fastify({ logger: true });

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key-change-in-production";

// Register plugins
app.register(cors, {
  origin: true,
  credentials: true
});

app.register(jwt, {
  secret: JWT_SECRET,
  sign: {
    expiresIn: '7d'
  }
});

app.register(cookie);

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(githubRoutes, { prefix: '/api/github' });

app.get("/", async () => ({ 
  status: "live",
  message: "CodeDuck API v1",
  timestamp: new Date().toISOString()
}));

app.get("/health", async () => ({
  status: "healthy",
  uptime: process.uptime(),
  environment: process.env.NODE_ENV || "development"
}));

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "4000");
    await app.listen({ 
      port,
      host: "0.0.0.0"
    });
    app.log.info(`Server listening on port ${port}`);
    console.log(`\n🚀 Backend Debug: http://100.79.131.40:4001\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();