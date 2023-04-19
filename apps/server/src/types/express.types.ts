import type { AuthenticatedUser } from '@prs/common';

interface AuthenticatedRequestPayload {
  user: AuthenticatedUser;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request extends AuthenticatedRequestPayload {}
  }
}
