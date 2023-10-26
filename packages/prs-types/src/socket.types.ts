import type { Request } from "express";
import type { ExtWebSocket, PRSContext } from "./utils.types";

export type Event<D, R = void> = (methods: { ws: ExtWebSocket; req: Request }, data: D) => Promise<R>;
export type ClientEvent<D, R = void> = (data: D) => Promise<R> | R;

export type ConfirmEvent = Event<{ taskId: string; mode: "default" | "delete" }>;
export type MoveIndexEvent = Event<{ direction: "left" | "right" }>;
export type UpdateCurrentTaskEvent = Event<{ currentTaskIndex: number; currentTaskId: string }>;
export type GetContextEvent = Event<undefined, PRSContext>;

export interface ClientToServerEvents {
  confirm: ConfirmEvent;
  moveIndex: MoveIndexEvent;
  updateCurrentTask: UpdateCurrentTaskEvent;
  getContext: GetContextEvent;
}

export type MovedIndexEvent = ClientEvent<{ newIndex: number }>;
export type ConfirmedEvent = ClientEvent<{ taskId: string }>;
export type InitializeClientEvent = ClientEvent<PRSContext>;
export type PRSOnlineEvent = ClientEvent<boolean>;

export interface ServerToClientEvents {
  // updateCurrentTask: UpdateCurrentTask;
  movedIndex: MovedIndexEvent;
  confirmed: ConfirmedEvent;
  initializeClient: InitializeClientEvent;
  prsOnline: PRSOnlineEvent;
}
