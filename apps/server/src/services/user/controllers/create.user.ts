import type { Controller, CreateUser } from '@prs/common';
import { StatusCodes } from 'http-status-codes';
import { createUserValidation } from '@prs/common';
import { prisma } from '../../../config';
import { formatResponse, handleControllerError } from '../../../lib/utils';

const handler: Controller<CreateUser> = async (req, res) => {
  const { success, error } = formatResponse<CreateUser>(res);
  try {
    const existingUser = await prisma.user.findUnique({ where: { pin: req.body.pin } });
    if (existingUser) return error(StatusCodes.BAD_REQUEST, 'A user with that PIN already exists');
    const user = await prisma.user.create({ data: req.body });
    return success(StatusCodes.CREATED, user);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const createUser = { handler, schema: createUserValidation };
