import type { Controller, GetDay } from "prs-types";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<GetDay> = async (req, res) => {
  const { success, error } = formatResponse<GetDay>(res);
  try {
    const date = dayjs(req.query.date);
    const startOfDay = date.startOf("day").toDate();
    const endOfDay = date.endOf("day").toDate();

    const day = await prisma.day.findFirst({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      include: { tasks: { orderBy: { updatedAt: "asc" } } },
    });

    day.tasks.sort((t1, t2) => {
      if (t1.complete) return 1;
      if (t2.complete) return -1;
      return 0;
    });

    if (!day) return error(StatusCodes.BAD_REQUEST, "No day associated with date");
    return success(StatusCodes.OK, day);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getDay = { handler };
