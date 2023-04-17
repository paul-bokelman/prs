import type { Controller, AuthenticatedUser } from "~/types";
import { StatusCodes } from "http-status-codes";
import { formatResponse } from "~/lib/utils";

interface GetUser {
  args: undefined;
  payload: AuthenticatedUser;
}

const handler: Controller<GetUser> = async (req, res) => {
  const { success } = formatResponse<GetUser>(res);
  return success(StatusCodes.OK, req.user);
};

export const getUser = { handler };
