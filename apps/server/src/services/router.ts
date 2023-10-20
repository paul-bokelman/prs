import { Router } from "express";
import { tasks } from "./task";

export const services = Router();

services.use("/tasks", tasks);
