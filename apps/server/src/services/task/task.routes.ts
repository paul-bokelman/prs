import { Router } from "express";
import * as controllers from "./controllers";
// import { validate } from "../../middleware";

export const tasks = Router();

tasks.get("/:id", controllers.getTask.handler);
tasks.post("/:id/update", controllers.updateTask.handler);
tasks.post("/:id/delete", controllers.deleteTask.handler);
tasks.post("/create", controllers.createTask.handler);
