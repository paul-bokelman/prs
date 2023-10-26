import type { Controller, CreateTask } from "prs-types";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";
import dayjs from "dayjs";

const handler: Controller<CreateTask> = async (req, res) => {
  const { success } = formatResponse<CreateTask>(res);
  try {
    let { due, order, ...data } = req.body;

    due = dayjs(due).endOf("day").add(-1, "minute").toDate();

    const newTask = await prisma.task.create({
      data: { due, order: order ? order : await prisma.task.count(), ...data },
    });

    // check if current day, if so update context

    return success(StatusCodes.OK, newTask);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const createTask = { handler };
