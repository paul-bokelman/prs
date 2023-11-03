import type { ExtWebSocket, PRSContext } from "prs-types";
import type { WebsocketRequestHandler } from "express-ws";
import { context } from "../lib/context";

// todo: get rid of this? (only runs on mount)
export const withContext: WebsocketRequestHandler = async (ws: ExtWebSocket, req, next) => {
  if (req.url.includes("?client=")) {
    const identifier = req.url.split("?client=")[1];
    ws.identifier = identifier;
  }

  const ctx = await context.revalidate();

  req.context = ctx;
  next();
};
