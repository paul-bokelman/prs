import type { Controller, GetDay } from "prs-types";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import { prisma } from "../../../config";
import { formatResponse, handleControllerError, prismaUtils } from "../../../lib/utils";

const handler: Controller<GetDay> = async (req, res) => {
  const { success, error } = formatResponse<GetDay>(res);
  try {
    const day = await prismaUtils.getDay(req.query.date);

    // day.tasks.sort((t1, t2) => {
    //   if (t1.complete) return 1;
    //   if (t2.complete) return -1;
    //   return 0;
    // });

    if (!day) return error(StatusCodes.BAD_REQUEST, "No day associated with date");
    return success(StatusCodes.OK, day);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getDay = { handler };
