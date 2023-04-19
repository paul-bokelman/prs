import type { Controller, DeleteTask } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { deleteTaskValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<DeleteTask> = async (req, res) => {
  const { success, error } = formatResponse<DeleteTask>(res);
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, select: { id: true, userId: true } });
    if (!task) return error(StatusCodes.NOT_FOUND, 'No task associated with that ID');
    if (task.userId !== req.user.id) return error(StatusCodes.BAD_REQUEST, 'You can only delete your own tasks');
    await prisma.task.delete({ where: { id: req.params.id } });
    return success(StatusCodes.OK);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const deleteTask = { handler, schema: deleteTaskValidation };
