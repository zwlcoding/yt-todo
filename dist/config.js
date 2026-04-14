"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const configSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("3000"),
    HOST: zod_1.z.string().default("0.0.0.0"),
    DATABASE_URL: zod_1.z.string(),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    CORS_ORIGIN: zod_1.z.string().default("*"),
});
exports.config = configSchema.parse(process.env);
