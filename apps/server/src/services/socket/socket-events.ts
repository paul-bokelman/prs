import { confirmEvent, moveIndexEvent, updateCurrentTaskEvent, getContext } from "./events";

export const socketEvents = {
  confirm: confirmEvent,
  moveIndex: moveIndexEvent,
  updateCurrentTask: updateCurrentTaskEvent,
  getContext: getContext,
};
