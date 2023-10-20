import type { ReasonPhrases } from "http-status-codes";
import type { RequestHandler } from "express";

export interface ServerError {
  code: number;
  reason: ReasonPhrases;
  message?: string;
  errors?: unknown;
}

export type ControllerConfig = {
  params: Record<string, any>;
  body: Record<string, any>;
  query: Record<string, any>;
  payload: Record<string, any>;
};

export type Controller<C extends ControllerConfig> = RequestHandler<C["params"], C["payload"], C["body"], C["query"]>;
