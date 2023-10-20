import type { Controller, GetTasks } from "prs-types";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<GetTasks> = async (req, res) => {
  const { success, error } = formatResponse<GetTasks>(res);
  try {
    const date = dayjs(req.query.date);
    const startOfDay = date.startOf("day").toDate();
    const endOfDay = date.endOf("day").toDate();

    const tasks = await prisma.task.findMany({
      where: { due: { gte: startOfDay, lt: endOfDay } },
      orderBy: { order: "asc" },
    });
    if (!tasks) return error(StatusCodes.BAD_REQUEST, "No tasks associated with that date");
    return success(StatusCodes.OK, tasks);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTasks = { handler };
