import type { ClientToServerEvents } from "prs-common";

interface ExtendedWebSocket extends WebSocket {
  dispatch: WebSocketSend;
}

type WebSocketSend = <T extends keyof ClientToServerEvents>(
  message: Parameters<ClientToServerEvents[T]>[1] extends undefined ? [T] : [T, Parameters<ClientToServerEvents[T]>[1]]
) => void;

export const ws = new WebSocket("ws://localhost:8000/ws?client=web") as ExtendedWebSocket;

const dispatch: WebSocketSend = (message) => {
  return ws.send(JSON.stringify(message));
};

ws.dispatch = dispatch;
