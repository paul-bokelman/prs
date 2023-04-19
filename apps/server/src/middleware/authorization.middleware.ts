import type { AuthenticatedUser } from '@prs/common';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config';
import { formatResponse } from '../lib/utils';

export const isAuthorized = () => {
  //! All routes with authorization should have pin payload validation?
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = formatResponse(res);

    const authorized = (user: AuthenticatedUser) => {
      req.user = user;
      return next();
    };

    (req.user as unknown) = null;

    const pin = req.headers.authorization ? parseInt(req.headers.authorization.split('Basic ')[1]) : undefined;
    if (typeof pin !== 'number') return error(StatusCodes.UNAUTHORIZED, 'PIN is invalid'); // technically validation error?

    try {
      const user = await prisma.user.findUnique({ where: { pin } });
      if (!user) return error(StatusCodes.UNAUTHORIZED, 'No user associated with that PIN'); // technically not found...

      return authorized(user);
    } catch (e) {
      if (e instanceof Error) return error(StatusCodes.UNAUTHORIZED, e.message);
      return error(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
};
