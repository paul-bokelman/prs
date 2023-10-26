import type { ExtWebSocket, PRSContext } from "prs-types";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import WebSocket, { Instance } from "express-ws";
import { services } from "./services/router";
import { socketEvents } from "./services/socket/socket-events";
import { env, preflightENV } from "./lib/env";
import { wsu } from "./lib/utils";
import { context } from "./lib/context";
import { withContext } from "./middleware/context.middleware";

preflightENV();

declare global {
  namespace Express {
    interface Request {
      context: PRSContext;
    }
  }
}

(async () => {
  await context.init({ currentId: "", currentIndex: 0, maxIndex: 0, mode: "default" }); // should be null
})();

export const instance: Instance = WebSocket(express());
const app = instance.app;

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/api", services);

instance.getWss().on("connection", async (ws: ExtWebSocket, req) => {
  if (req.url.includes("?client=")) {
    const identifier = req.url.split("?client=")[1];
    ws.identifier = identifier;
  }

  if (ws.identifier === "physical") {
    wsu(ws).success(["prsOnline", true]); // have to broadcast this to all clients
  }

  if (ws.identifier === "web") {
    const ctx = await context.get();
    ws.send(JSON.stringify(["initializeClient", ctx]));
  }

  ws.on("close", (e) => wsu(ws).success(["prsOnline", false]));
});

app.ws("/ws", withContext, (ws: ExtWebSocket, req) => {
  ws.on("message", async (msg, isBinary) => {
    if (isBinary) return wsu(ws).error("Binary messages are not supported");
    const [event, data] = JSON.parse(msg.toString()) as [string, unknown]; // this could cause trouble
    if (!Object.keys(socketEvents).includes(event)) return wsu(ws).error("Invalid event");
    await socketEvents[event]({ ws, req }, data);
  });
});

const port = env("PORT") || 8000;

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
