import type { Controller, GetTasks } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<GetTasks> = async (req, res) => {
  const { success, error } = formatResponse<GetTasks>(res);
  try {
    const tasks = await prisma.user.findUnique({ where: { id: req.user.id } }).tasks();
    if (!tasks) return error(StatusCodes.BAD_REQUEST, 'User has no tasks');
    return success(StatusCodes.OK, tasks);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTasks = { handler };
