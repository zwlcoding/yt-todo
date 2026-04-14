import { FastifyInstance } from "fastify";
import { trackEventSchema } from "../lib/validators";
import { trackEvent } from "../services/event-service";

export default async function eventRoutes(app: FastifyInstance) {
  app.post("/api/events", async (request, reply) => {
    const parsed = trackEventSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
    }

    const event = await trackEvent(parsed.data.eventName, parsed.data.properties);
    return reply.status(201).send({ data: event });
  });
}
