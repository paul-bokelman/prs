import * as ws from "ws";
import { instance } from "../../main";

const broadcast = (data: [string, unknown] | { error: boolean; message: string } | string) =>
  instance.getWss().clients.forEach((client) => client.send(typeof data === "string" ? data : JSON.stringify(data)));

export const wsu = (ws: ws) => {
  return {
    error: (message: string) => broadcast({ error: true, message }),
    success: broadcast,
  };
};
