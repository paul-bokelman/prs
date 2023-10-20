import type { Controller, DeleteTask } from "prs-types";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<DeleteTask> = async (req, res) => {
  const { success, error } = formatResponse<DeleteTask>(res);
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return error(StatusCodes.BAD_REQUEST, "No task associated with that ID");

    const deletedTask = await prisma.task.delete({ where: { id: req.params.id } });

    return success(StatusCodes.OK, deletedTask);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const deleteTask = { handler };
