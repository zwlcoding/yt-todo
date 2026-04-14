import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1).max(500),
  listToken: z.string().optional(),
});

export const createListSchema = z.object({
  name: z.string().min(1).max(255).optional(),
});

export const trackEventSchema = z.object({
  eventName: z.string().min(1).max(100),
  properties: z.record(z.unknown()).optional(),
});
