import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createListSchema } from "../lib/validators";
import { createList, getListByToken, addTodoToList } from "../services/list-service";

const addTodoSchema = z.object({
  title: z.string().min(1).max(500),
});

export default async function listRoutes(app: FastifyInstance) {
  app.post("/api/lists", async (request, reply) => {
    const parsed = createListSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
    }

    const list = await createList(parsed.data.name);
    return reply.status(201).send({ data: list });
  });

  app.get("/api/lists/:token", async (request, reply) => {
    const { token } = request.params as { token: string };
    const list = await getListByToken(token);
    if (!list) {
      return reply.status(404).send({ error: "List not found" });
    }
    return reply.send({ data: list });
  });

  app.post("/api/lists/:token/todos", async (request, reply) => {
    const { token } = request.params as { token: string };
    const parsed = addTodoSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
    }

    try {
      const result = await addTodoToList(token, parsed.data.title);
      return reply.status(201).send({ data: result.todo });
    } catch (err: any) {
      if (err.message === "List not found") {
        return reply.status(404).send({ error: "List not found" });
      }
      throw err;
    }
  });
}
