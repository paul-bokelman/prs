import { Router } from "express";
import * as controllers from "./controllers";
// import { validate } from "../../middleware";

export const days = Router();

days.get("/", controllers.getDay.handler);
