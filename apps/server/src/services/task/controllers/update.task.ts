import type { Controller, UpdateTask } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { updateTaskValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<UpdateTask> = async (req, res) => {
  const { success, error } = formatResponse<UpdateTask>(res);
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, select: { id: true, userId: true } });
    if (!task) return error(StatusCodes.NOT_FOUND, 'No task associated with that ID');
    if (task.userId !== req.user.id) return error(StatusCodes.BAD_REQUEST, 'You can only delete your own tasks');
    const updatedTask = await prisma.task.update({ where: { id: task.id }, data: req.body });
    return success(StatusCodes.CREATED, updatedTask);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const updateTask = { handler, schema: updateTaskValidation };
