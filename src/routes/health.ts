import { FastifyInstance } from "fastify";
import { pool } from "../db";

export default async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    try {
      await pool.query("SELECT 1");
      return reply.send({ status: "ok", db: "connected" });
    } catch (err) {
      return reply.status(503).send({ status: "error", db: "disconnected" });
    }
  });
}
