import type { Controller, GetTask } from "prs-types";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<GetTask> = async (req, res) => {
  const { success, error } = formatResponse<GetTask>(res);
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: { day: true } });
    if (!task) return error(StatusCodes.BAD_REQUEST, "No task associated with that ID");
    return success(StatusCodes.OK, task);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTask = { handler };
