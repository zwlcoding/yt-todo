"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = healthRoutes;
const db_1 = require("../db");
async function healthRoutes(app) {
    app.get("/health", async (_request, reply) => {
        try {
            await db_1.pool.query("SELECT 1");
            return reply.send({ status: "ok", db: "connected" });
        }
        catch (err) {
            return reply.status(503).send({ status: "error", db: "disconnected" });
        }
    });
}
