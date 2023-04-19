import type { ReasonPhrases } from 'http-status-codes';
import type { RequestHandler } from 'express';

// basically just here for server error...

export type Controller<C extends ControllerConfig> = RequestHandler<
  PossiblyUndefined<C['args'], 'params'>,
  C['payload'] | ServerError,
  PossiblyUndefined<C['args'], 'body'>,
  PossiblyUndefined<C['args'], 'query'>
>;

type PossiblyUndefined<A extends ControllerConfig['args'], K> = A extends undefined
  ? unknown
  : K extends keyof A
  ? A[K]
  : unknown;

export interface ControllerConfig {
  args:
    | {
        params?: Record<string, unknown> | undefined;
        body?: Record<string, unknown> | undefined;
        query?: Record<string, unknown> | undefined;
      }
    | undefined;
  payload: Record<string, unknown> | Record<string, unknown>[] | undefined;
}

export interface ServerError {
  code: number;
  reason: ReasonPhrases;
  message?: string;
  errors?: unknown;
}
