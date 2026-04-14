"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackEventSchema = exports.createListSchema = exports.createTodoSchema = void 0;
const zod_1 = require("zod");
exports.createTodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    listToken: zod_1.z.string().optional(),
});
exports.createListSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
});
exports.trackEventSchema = zod_1.z.object({
    eventName: zod_1.z.string().min(1).max(100),
    properties: zod_1.z.record(zod_1.z.unknown()).optional(),
});
