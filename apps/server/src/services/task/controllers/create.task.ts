import type { Controller, CreateTask } from "prs-types";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<CreateTask> = async (req, res) => {
  const { success } = formatResponse<CreateTask>(res);
  try {
    let { due, order, ...data } = req.body;

    due = new Date(due);
    due.setUTCHours(23, 59, 59, 999);

    const newTask = await prisma.task.create({
      data: { due, order: order ? order : await prisma.task.count(), ...data },
    });

    return success(StatusCodes.OK, newTask);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const createTask = { handler };
