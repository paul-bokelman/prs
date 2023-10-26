import type { Controller, DeleteTask } from "prs-types";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";
import { context } from "../../../lib";

const handler: Controller<DeleteTask> = async (req, res) => {
  const { success, error } = formatResponse<DeleteTask>(res);
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return error(StatusCodes.BAD_REQUEST, "No task associated with that ID");

    const deletedTask = await prisma.task.delete({ where: { id: req.params.id }, include: { day: true } });
    const isCurrentDay = deletedTask.day.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

    // if it's the current day, context needs to be updated to reflect the deletion
    // if (isCurrentDay) {
    //   await context.update((ctx) => {
    //     ctx.maxIndex = ctx.maxIndex - 1;

    //     if (ctx.maxIndex < 0) {
    //       ctx.maxIndex = null;
    //       ctx.currentIndex = null;
    //       ctx.currentId = null;
    //       return ctx;
    //     }
    //     if (ctx.currentIndex > ctx.maxIndex) {
    //       ctx.currentIndex = ctx.maxIndex;

    //       // await prisma.task.findUnique({where: {day: {id: deletedTask.id}}})

    //       ctx.currentId = null; // not sure what to do here
    //     }
    //     return ctx;
    //   });
    // }

    return success(StatusCodes.OK, deletedTask);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const deleteTask = { handler };
