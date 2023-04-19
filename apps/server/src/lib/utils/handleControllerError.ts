import type { Response } from 'express';
import type { ServerError } from '@prs/common';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { formatResponse } from '../../lib/utils';

export const handleControllerError = (e: unknown, res: Response<ServerError>) => {
  const { error } = formatResponse(res);

  if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Error) {
    return error(StatusCodes.INTERNAL_SERVER_ERROR, `Unhandled Exception: ${e.message}`);
  }

  return error(StatusCodes.INTERNAL_SERVER_ERROR);
};
