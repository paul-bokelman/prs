import type { ExtWebSocket, PRSContext } from "prs-types";
import { prisma } from "../config";
import { context } from "../lib/context";
import type { WebsocketRequestHandler } from "express-ws";
import dayjs from "dayjs";

// mode and other params could be passed over query string?
export const withContext: WebsocketRequestHandler = async (ws: ExtWebSocket, req, next) => {
  if (req.url.includes("?client=")) {
    const identifier = req.url.split("?client=")[1];
    ws.identifier = identifier;
  }

  let currentContext = await context.get();

  // should come from ws event (client)?
  // duplicate logic...
  const date = dayjs(dayjs().format("YYYY-MM-DD"));
  const startOfDay = date.startOf("day").toDate();
  const endOfDay = date.endOf("day").toDate();
  const maxIndex = (await prisma.task.count({ where: { due: { gte: startOfDay, lte: endOfDay } } })) - 1;

  if (currentContext.maxIndex !== maxIndex) currentContext.maxIndex = maxIndex;

  req.context = currentContext;
  next();
};
