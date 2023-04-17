import { Router } from "express";
import { users } from "./user";
import { tasks } from "./task";

export const services = Router();

services.use("/users", users);
services.use("/tasks", tasks);
