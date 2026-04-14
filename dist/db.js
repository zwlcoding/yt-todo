"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.withClient = withClient;
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
}
exports.pool = new pg_1.Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
exports.pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
async function withClient(fn) {
    const client = await exports.pool.connect();
    try {
        return await fn(client);
    }
    finally {
        client.release();
    }
}
