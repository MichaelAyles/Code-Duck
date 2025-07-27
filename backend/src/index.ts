import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const app = Fastify({ logger: true });

app.register(cors, {
  origin: true,
  credentials: true
});

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
    const port = parseInt(process.env.PORT || "3000");
    await app.listen({ 
      port,
      host: "0.0.0.0"
    });
    app.log.info(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();