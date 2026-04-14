import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { pool } from "./db";

import healthRoutes from "./routes/health";
import todoRoutes from "./routes/todos";
import listRoutes from "./routes/lists";
import shareRoutes from "./routes/share";
import eventRoutes from "./routes/events";

const app = fastify({ logger: true });

async function start() {
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || "*",
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "15 minutes",
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: (_req, _context) => ({
      error: "Too many requests from this IP, please try again later.",
    }),
  });

  await app.register(healthRoutes);
  await app.register(todoRoutes);
  await app.register(listRoutes);
  await app.register(shareRoutes);
  await app.register(eventRoutes);

  const port = parseInt(process.env.PORT || "3000", 10);
  const host = process.env.HOST || "0.0.0.0";
  await app.listen({ port, host });
}

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await app.close();
  await pool.end();
});

process.on("SIGINT", async () => {
  await app.close();
  await pool.end();
});
