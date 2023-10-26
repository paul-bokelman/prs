import type { Day, Task } from "@prisma/client";

/* ---------------------------------- DAYS ---------------------------------- */

export interface GetDay {
  params: {};
  body: {};
  query: { date: string };
  payload: Day & { tasks: Array<Task> };
}

/* ---------------------------------- TASKS --------------------------------- */

// should be generated from validation
export interface GetTask {
  params: { id: string };
  body: {};
  query: {};
  payload: Task & { day: Day };
}

export interface UpdateTask {
  params: { id: string };
  body: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;
  query: {};
  payload: Task;
}

export interface DeleteTask {
  params: { id: string };
  body: {};
  query: {};
  payload: Task & { day: Day };
}

export interface CreateTask {
  params: {};
  body: Pick<Task, "description" | "reoccurring" | "complete"> & { day: { id: string } | string }; // string is date
  query: {};
  payload: Task & { day: Day };
}
