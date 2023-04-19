import type { Controller, GetUsers } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

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
