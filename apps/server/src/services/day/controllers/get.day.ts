import type { Controller, GetDay } from "prs-types";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError } from "../../../lib/utils";

const handler: Controller<GetDay> = async (req, res) => {
  const { success, error } = formatResponse<GetDay>(res);
  try {
    const day = await prisma.utils.getDay(req.query.date);

    const totalTasksCompleted = await prisma.task.count({
      where: { complete: { equals: true } },
    });

    const stats: GetDay["payload"]["stats"] = {
      streak: 2, // todo: calculate streak
      totalTasksCompleted,
    };

    if (!day) return error(StatusCodes.BAD_REQUEST, "No day associated with date");
    return success(StatusCodes.OK, { stats, ...day });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getDay = { handler };
