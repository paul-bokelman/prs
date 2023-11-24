import type { Day, Task } from "@prisma/client";
import type { ControllerConfig } from "./utils.types";
import * as z from "zod";
import { AnyZodObject } from "zod";

type ToControllerConfig<S extends AnyZodObject, P = ControllerConfig["payload"]> = {
  params: z.infer<S>["params"];
  body: z.infer<S>["body"];
  query: z.infer<S>["query"];
  payload: P;
};

/* ---------------------------------- DAYS ---------------------------------- */

export type GetDay = ToControllerConfig<
  typeof getDaySchema,
  Day & {
    tasks: Array<Task>;
    stats: { streak: number; totalCompleted: number; ratio: { incline: boolean; value: string } };
  }
>;

const getDaySchema = z.object({
  query: z.object({ date: z.string() }),
});

/* ---------------------------------- TASKS --------------------------------- */

export type GetTask = ToControllerConfig<typeof getTaskSchema, Task & { day: Day }>;
const getTaskSchema = z.object({ params: z.object({ id: z.string() }) });

export type UpdateTask = ToControllerConfig<typeof updateTaskSchema, Task>;
const updateTaskSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z
    .object({
      description: z.string().max(50, "Cannot exceed 50 characters").min(3, "Cannot be less than 3 characters"),
      complete: z.boolean(),
      reoccurring: z.boolean(),
      dayId: z.string(),
    })
    .partial()
    .refine(
      ({ description, complete, reoccurring, dayId }) =>
        description !== undefined || complete !== undefined || reoccurring !== undefined || dayId !== undefined,
      { message: "One of the fields must be defined" }
    ),
});

export type DeleteTask = ToControllerConfig<typeof deleteTaskSchema, Task & { day: Day }>;
const deleteTaskSchema = z.object({ params: z.object({ id: z.string() }) });

export type CreateTask = ToControllerConfig<typeof createTaskSchema, Task & { day: Day }>;
const createTaskSchema = z.object({
  body: z.object({
    description: z.string().max(50, "Cannot exceed 50 characters").min(3, "Cannot be less than 3 characters"),
    reoccurring: z.boolean().default(false),
    complete: z.boolean().default(false),
    day: z.object({ id: z.string() }).or(z.string()),
  }),
});

/* --------------------------------- SCHEMAS -------------------------------- */

export const schemas = {
  day: { get: getDaySchema },
  task: {
    get: getTaskSchema,
    update: updateTaskSchema,
    delete: deleteTaskSchema,
    create: createTaskSchema,
  },
};
