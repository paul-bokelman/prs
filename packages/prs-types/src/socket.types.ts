import type { Request } from "express";

export type Event<D, R = void> = (context: { ws: WebSocket; req: Request }, data: D) => Promise<R>;

export type ConfirmEvent = Event<{ taskId: string; mode: "default" | "delete" }>;
export type MoveIndexEvent = Event<{ direction: "left" | "right" }>;

export interface ClientToServerEvents {
  confirm: ConfirmEvent;
  test: (data: any) => void;
}

export type ConfirmEventResponse = () => void;

export interface ServerToClientEvents {
  "confirm:success": ConfirmEventResponse;
}
