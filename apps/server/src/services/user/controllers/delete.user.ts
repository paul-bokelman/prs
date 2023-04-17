import type { Controller } from "~/types";
import { StatusCodes } from "http-status-codes";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface DeleteUser {
  args: undefined;
  payload: undefined;
}

const handler: Controller<DeleteUser> = async (req, res) => {
  const { success } = formatResponse<DeleteUser>(res);
  try {
    await prisma.user.delete({ where: { pin: req.user.pin } });
    return success(StatusCodes.OK);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const deleteUser = { handler };
