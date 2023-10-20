import type { ServerToClientEvents, ClientToServerEvents } from "prs-types";
import { Socket, io } from "socket.io-client";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:8000/", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
