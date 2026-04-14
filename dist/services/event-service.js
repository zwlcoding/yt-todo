"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackEvent = trackEvent;
const db_1 = require("../db");
async function trackEvent(eventName, properties) {
    return (0, db_1.withClient)(async (client) => {
        const result = await client.query(`INSERT INTO events (event_name, properties)
       VALUES ($1, $2)
       RETURNING id, event_name, properties, created_at`, [eventName, JSON.stringify(properties || {})]);
        const row = result.rows[0];
        return {
            id: row.id,
            userId: null,
            eventName: row.event_name,
            properties: row.properties,
            createdAt: row.created_at,
        };
    });
}
