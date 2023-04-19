import type { Controller, GetUser } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { formatResponse } from '../../../lib/utils';

const handler: Controller<GetUser> = async (req, res) => {
  const { success } = formatResponse<GetUser>(res);
  return success(StatusCodes.OK, req.user);
};

export const getUser = { handler };
