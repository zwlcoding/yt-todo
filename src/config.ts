import { z } from "zod";

const configSchema = z.object({
  PORT: z.string().default("3000"),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("*"),
});

export const config = configSchema.parse(process.env);
