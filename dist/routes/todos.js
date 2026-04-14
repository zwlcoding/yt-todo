"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = todoRoutes;
const validators_1 = require("../lib/validators");
const todo_service_1 = require("../services/todo-service");
async function todoRoutes(app) {
    app.get("/api/todos", async (_request, reply) => {
        const todos = await (0, todo_service_1.listTodos)();
        return reply.send({ data: todos });
    });
    app.post("/api/todos", async (request, reply) => {
        const parsed = validators_1.createTodoSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
        }
        const { title, listToken } = parsed.data;
        const todo = await (0, todo_service_1.createTodo)(title, listToken);
        return reply.status(201).send({ data: todo });
    });
    app.patch("/api/todos/:id/complete", async (request, reply) => {
        const { id } = request.params;
        const todo = await (0, todo_service_1.completeTodo)(id);
        if (!todo) {
            return reply.status(404).send({ error: "Todo not found" });
        }
        return reply.send({ data: todo });
    });
    app.delete("/api/todos/:id", async (request, reply) => {
        const { id } = request.params;
        await (0, todo_service_1.deleteTodo)(id);
        return reply.status(204).send();
    });
    app.post("/api/todos/seed", async (_request, reply) => {
        const todos = await (0, todo_service_1.seedTodos)();
        return reply.status(201).send({ data: todos });
    });
}
