import type { Controller, GetTask } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { getTaskValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<GetTask> = async (req, res) => {
  const { success, error } = formatResponse<GetTask>(res);
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true } } },
    });
    if (!task) return error(StatusCodes.BAD_REQUEST, 'No task associated with that ID');
    if (task.user.id !== req.user.id) return error(StatusCodes.UNAUTHORIZED, 'You can only get your own tasks');
    return success(StatusCodes.OK, task);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTask = { handler, schema: getTaskValidation };
