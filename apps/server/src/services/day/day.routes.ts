import { Router } from "express";
import { schemas } from "prs-common";
import * as controllers from "./controllers";
import { validate } from "../../middleware";

export const days = Router();

days.get("/", validate(schemas.day.get), controllers.getDay);
