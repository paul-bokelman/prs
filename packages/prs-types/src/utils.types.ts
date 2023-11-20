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
  success: ServerToClientSuccessEvent;
  error: ServerToClientErrorEvent;
  broadcast: <T extends keyof ServerToClientEvents>(data: ServerToClientEventArgs<T>) => void;
}

export type WebSocketResponseOptions = {
  scoped?: boolean;
};

export type ServerToClientErrorArgs = string;

export type ServerToClientEventArgs<T extends keyof ServerToClientEvents> =
  | [T, Parameters<ServerToClientEvents[T]>[0]]
  | ServerToClientErrorArgs;

export type ServerToClientSuccessArgs<T extends keyof ServerToClientEvents> = Exclude<
  ServerToClientEventArgs<T>,
  ServerToClientErrorArgs
>;

export type ServerToClientSuccessEvent = <T extends keyof ServerToClientEvents>(
  data: ServerToClientSuccessArgs<T>,
  options?: WebSocketResponseOptions
) => void;

export type ServerToClientErrorEvent = (message: ServerToClientErrorArgs, options?: WebSocketResponseOptions) => void;
