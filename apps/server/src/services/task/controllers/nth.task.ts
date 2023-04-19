import type { Controller, NthTask } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { nthTaskValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<NthTask> = async (req, res) => {
  const { success, error } = formatResponse<NthTask>(res);
  const n = parseInt(req.params.n);
  try {
    const tasks = await prisma.user.findUnique({ where: { id: req.user.id } }).tasks({ orderBy: { due: 'desc' } });
    if (!tasks || tasks.length === 0) return error(StatusCodes.BAD_REQUEST, 'User has no tasks');
    if (n > tasks.length) return error(StatusCodes.BAD_REQUEST, `${n} is out of range of task list (${tasks.length})`);
    return success(StatusCodes.OK, tasks[n - 1]);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const nthTask = { handler, schema: nthTaskValidation };
