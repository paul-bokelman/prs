import axios from "axios";
import { ControllerConfig, GetDay, DeleteTask, UpdateTask, CreateTask } from "prs-types";
import { QueryClient } from "react-query";
// import dayjs from "dayjs";

export const qc = new QueryClient();

export const client = axios.create({
  baseURL: "http://localhost:8000/api", // TODO: use env
  withCredentials: true,
});

const get = <C extends ControllerConfig>(url: string) => client.get<C["payload"]>(url).then((r) => r.data);
const post = <C extends ControllerConfig>(url: string, data?: C["body"]) =>
  client.post<C["payload"]>(url, data).then((r) => r.data);

/* ---------------------------------- DAYS ---------------------------------- */
const getDay = (date: string) => get<GetDay>(`/days?date=${date}`);

/* ---------------------------------- TASKS --------------------------------- */
const updateTask = (id: string, data: UpdateTask["body"]) => post<UpdateTask>(`/tasks/${id}/update`, data);
const deleteTask = (id: string) => post<DeleteTask>(`/tasks/${id}/delete`);
const createTask = (data: CreateTask["body"]) => post<CreateTask>(`/tasks/create`, data);

export const api = {
  days: {
    get: getDay,
  },
  tasks: {
    update: updateTask,
    delete: deleteTask,
    create: createTask,
  },
};
