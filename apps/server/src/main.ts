import express, { Express } from "express";
// import type { appToClientEvents, ClientToappEvents } from "prs-types";
import bodyParser from "body-parser";
import cors from "cors";
import { env, preflightENV } from "./lib/env";
import { services } from "./services/router";
import { socketEvents } from "./services/socket/socket-events";
import WebSocket, { Instance } from "express-ws";

preflightENV();

declare global {
  namespace Express {
    interface Request {
      locals: { prs: { id: string; currentIndex: number; maxIndex: number } };
    }
  }
}

export const instance: Instance = WebSocket(express());
const app = instance.app;

instance.getWss().on("connection", (ws, req) => {
  // initialize request locals
  // req.locals = { prs: { id: "test", currentIndex: 0, maxIndex: 0 } };

  ws.on("message", (msg) => {
    console.log("Received: ", msg);
    ws.send(msg);
  });
});

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/api", services);

const port = env("PORT") || 8000;

app.ws("/", (ws, req) => {
  const context = { ws, req };

  // ws.on('connection', (ws, req) => {})

  ws.on("message", async (msg, isBinary) => {
    if (isBinary) return ws.send(JSON.stringify({ error: "Binary not supported" }));
    const [event, data] = JSON.parse(msg.toString()) as [string, unknown]; // this could cause trouble
    if (!Object.keys(socketEvents).includes(event)) return ws.send(JSON.stringify({ error: "Invalid event" }));
    await socketEvents[event](context, data);
  });
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
