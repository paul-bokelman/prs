import * as ws from "ws";
import type { ServerToClientEvents } from "prs-types";
import { instance } from "../../main";

export const broadcast = <T extends keyof ServerToClientEvents>(
  data: [T, Parameters<ServerToClientEvents[T]>[0]] | { error: boolean; message: string } | string
) => instance.getWss().clients.forEach((client) => client.send(typeof data === "string" ? data : JSON.stringify(data)));

// todo: should just exist on ws object globally, and not need to be passed in or imported
export const wsu = (ws: ws) => {
  return {
    error: (message: string) => broadcast({ error: true, message }),
    success: broadcast,
  };
};
