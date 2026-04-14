import { z } from "zod";
export declare const createTodoSchema: z.ZodObject<{
    title: z.ZodString;
    listToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    listToken?: string | undefined;
}, {
    title: string;
    listToken?: string | undefined;
}>;
export declare const createListSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export declare const trackEventSchema: z.ZodObject<{
    eventName: z.ZodString;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    eventName: string;
    properties?: Record<string, unknown> | undefined;
}, {
    eventName: string;
    properties?: Record<string, unknown> | undefined;
}>;
