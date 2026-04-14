import { FastifyInstance } from "fastify";
import { createTodoSchema } from "../lib/validators";
import {
  listTodos,
  createTodo,
  completeTodo,
  deleteTodo,
  seedTodos,
} from "../services/todo-service";

export default async function todoRoutes(app: FastifyInstance) {
  app.get("/api/todos", async (_request, reply) => {
    const todos = await listTodos();
    return reply.send({ data: todos });
  });

  app.post("/api/todos", async (request, reply) => {
    const parsed = createTodoSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
    }

    const { title, listToken } = parsed.data;
    const todo = await createTodo(title, listToken);
    return reply.status(201).send({ data: todo });
  });

  app.patch("/api/todos/:id/complete", async (request, reply) => {
    const { id } = request.params as { id: string };
    const todo = await completeTodo(id);
    if (!todo) {
      return reply.status(404).send({ error: "Todo not found" });
    }
    return reply.send({ data: todo });
  });

  app.delete("/api/todos/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await deleteTodo(id);
    return reply.status(204).send();
  });

  app.post("/api/todos/seed", async (_request, reply) => {
    const todos = await seedTodos();
    return reply.status(201).send({ data: todos });
  });
}
