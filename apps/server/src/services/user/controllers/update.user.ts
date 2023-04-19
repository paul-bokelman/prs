import type { Controller, UpdateUser } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { updateUserValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<UpdateUser> = async (req, res) => {
  const { success } = formatResponse<UpdateUser>(res);
  const user = req.user;
  try {
    const updatedUser = await prisma.user.update({ where: { pin: user.pin }, data: req.body });
    return success(StatusCodes.OK, updatedUser);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const updateUser = { handler, schema: updateUserValidation };
