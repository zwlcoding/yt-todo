"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = eventRoutes;
const validators_1 = require("../lib/validators");
const event_service_1 = require("../services/event-service");
async function eventRoutes(app) {
    app.post("/api/events", async (request, reply) => {
        const parsed = validators_1.trackEventSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
        }
        const event = await (0, event_service_1.trackEvent)(parsed.data.eventName, parsed.data.properties);
        return reply.status(201).send({ data: event });
    });
}
