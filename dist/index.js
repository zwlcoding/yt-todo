"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const db_1 = require("./db");
const health_1 = __importDefault(require("./routes/health"));
const todos_1 = __importDefault(require("./routes/todos"));
const lists_1 = __importDefault(require("./routes/lists"));
const share_1 = __importDefault(require("./routes/share"));
const events_1 = __importDefault(require("./routes/events"));
const app = (0, fastify_1.default)({ logger: true });
async function start() {
    await app.register(cors_1.default, {
        origin: process.env.CORS_ORIGIN || "*",
    });
    await app.register(helmet_1.default, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    });
    await app.register(rate_limit_1.default, {
        max: 100,
        timeWindow: "15 minutes",
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: (_req, _context) => ({
            error: "Too many requests from this IP, please try again later.",
        }),
    });
    await app.register(health_1.default);
    await app.register(todos_1.default);
    await app.register(lists_1.default);
    await app.register(share_1.default);
    await app.register(events_1.default);
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
    await db_1.pool.end();
});
process.on("SIGINT", async () => {
    await app.close();
    await db_1.pool.end();
});
