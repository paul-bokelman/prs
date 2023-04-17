import type { User } from "@prisma/client";
import type { Controller } from "~/types";
import { StatusCodes } from "http-status-codes";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface GetUsers {
  args: undefined;
  payload: Array<Pick<User, "id" | "name" | "points">>;
}

const handler: Controller<GetUsers> = async (_, res) => {
  const { success } = formatResponse<GetUsers>(res);
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, points: true } });
    return success(StatusCodes.OK, users);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const getUsers = { handler };
