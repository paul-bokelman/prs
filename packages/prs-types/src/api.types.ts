import type { Task } from "@prisma/client";

/* ---------------------------------- TASKS --------------------------------- */

// should be generated from validation
export interface GetTask {
  params: { id: string };
  body: {};
  query: {};
  payload: Task;
}

export interface GetTasks {
  params: {};
  body: {};
  query: { date: string };
  payload: Array<Task>;
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
  payload: Task;
}

export interface CreateTask {
  params: {};
  body: Omit<Task, "id" | "createdAt" | "updatedAt">;
  query: {};
  payload: Task;
}
