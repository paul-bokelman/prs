import type { ReasonPhrases } from "http-status-codes";
import type { RequestHandler } from "express";
import type { ServerToClientEvents } from "./socket.types";
import * as ws from "ws";

export interface PRSContext {
  currentDayId: string;
  currentId: string | null;
  currentIndex: number | null;
  maxIndex: number | null;
  mode: "default" | "delete";
}

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

export interface ExtWebSocket extends ws {
  identifier?: string; // your custom property
  alive: boolean;
  broadcast: <T extends keyof ServerToClientEvents>(
    data: [T, Parameters<ServerToClientEvents[T]>[0]] | { error: boolean; message: string } | string
  ) => void;
}
