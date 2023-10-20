import { confirmEvent, moveIndexEvent } from "./events";

export const wsRes = (ws: WebSocket) => {
  return {
    error: (message: string) => ws.send(JSON.stringify({ error: true, message })),
    success: (message: string) => ws.send(JSON.stringify({ error: false, message })),
  };
};

export const socketEvents = {
  confirm: confirmEvent, // switches task status or deletes task (depending on mode), gets taskId from selectedIndex
  moveIndex: moveIndexEvent,
  // moveIndex: moveIndexEvent, // moves selectedIndex up or down
  // changeMode: changeModeEvent, // changes mode (default, delete)
};
