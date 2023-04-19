import type { Controller, CreateTask } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { createTaskValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<CreateTask> = async (req, res) => {
  const { success } = formatResponse<CreateTask>(res);
  try {
    const task = await prisma.task.create({ data: { user: { connect: { id: req.user.id } }, ...req.body } });
    return success(StatusCodes.CREATED, task);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const createTask = { handler, schema: createTaskValidation };
