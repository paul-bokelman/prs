import type { Response } from "express";
import type { ControllerConfig, ServerError } from "prs-types";
import { getReasonPhrase } from "http-status-codes";

export const formatResponse = <C extends ControllerConfig>(res: Response) => {
  return {
    success: (status: number, payload?: C["payload"]) => {
      if (!payload) return res.status(status);
      return res.status(status).json(payload);
    },
    error: (status: number, message?: string, errors?: unknown): Response<ServerError> => {
      return res.status(status).json({
        code: status,
        reason: getReasonPhrase(status),
        message: message ?? undefined,
        errors,
      });
    },
  };
};
