"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listRoutes;
const zod_1 = require("zod");
const validators_1 = require("../lib/validators");
const list_service_1 = require("../services/list-service");
const addTodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
});
async function listRoutes(app) {
    app.post("/api/lists", async (request, reply) => {
        const parsed = validators_1.createListSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
        }
        const list = await (0, list_service_1.createList)(parsed.data.name);
        return reply.status(201).send({ data: list });
    });
    app.get("/api/lists/:token", async (request, reply) => {
        const { token } = request.params;
        const list = await (0, list_service_1.getListByToken)(token);
        if (!list) {
            return reply.status(404).send({ error: "List not found" });
        }
        return reply.send({ data: list });
    });
    app.post("/api/lists/:token/todos", async (request, reply) => {
        const { token } = request.params;
        const parsed = addTodoSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Invalid input", details: parsed.error.format() });
        }
        try {
            const result = await (0, list_service_1.addTodoToList)(token, parsed.data.title);
            return reply.status(201).send({ data: result.todo });
        }
        catch (err) {
            if (err.message === "List not found") {
                return reply.status(404).send({ error: "List not found" });
            }
            throw err;
        }
    });
}
