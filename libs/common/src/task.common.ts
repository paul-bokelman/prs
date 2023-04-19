import type { Task } from '@prisma/client';
import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

/* -------------------------------- GET TASKS ------------------------------- */

export interface GetTasks {
  args: undefined;
  payload: Array<Task>;
}

/* -------------------------------- NTH TASK -------------------------------- */

export interface NthTask {
  args: z.infer<typeof nthTaskValidation>;
  payload: Task;
}

export const nthTaskValidation = z.object({
  params: z.object({ n: z.string().refine((n) => typeof parseInt(n) === 'number') }),
});

/* -------------------------------- GET TASK -------------------------------- */

export interface GetTask {
  args: z.infer<typeof getTaskValidation>;
  payload: Task & { user: { id: string } };
}

export const getTaskValidation = z.object({
  params: z.object({ id: z.string() }),
});

/* -------------------------------- CREATE TASK ----------------------------- */

export interface CreateTask {
  args: z.infer<typeof createTaskValidation>;
  payload: Task;
}

export const createTaskValidation = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    points: z.number(),
    priority: z
      .number()
      .refine((n) => n >= 0 && n <= 10, 'Priority must be from 0 to 10')
      .optional(),
  }),
});

/* ------------------------------- DELETE TASK ------------------------------ */

export interface DeleteTask {
  args: z.infer<typeof deleteTaskValidation>;
  payload: Task;
}

export const deleteTaskValidation = z.object({
  params: z.object({ id: z.string() }),
});

/* ------------------------------- UPDATE TASK ------------------------------ */

export interface UpdateTask {
  args: z.infer<typeof updateTaskValidation>;
  payload: Task;
}

export const updateTaskValidation = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    description: z.string().optional(),
    points: z.number().optional(),
    priority: z
      .number()
      .refine((n) => n >= 0 && n <= 10, 'Priority must be from 0 to 10')
      .optional(),
  }),
});
