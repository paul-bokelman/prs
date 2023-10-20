import type { MoveIndexEvent } from "prs-types";
import { prisma } from "../../../config";
import { wsRes } from "../socket-events";

export const moveIndexEvent: MoveIndexEvent = async ({ ws, req }, { direction }) => {
  const { currentIndex, maxIndex } = req.locals.prs;
  let nextIndex = currentIndex + (direction === "left" ? -1 : 1);
  if (nextIndex < 0) nextIndex = maxIndex;
  if (nextIndex > maxIndex) nextIndex = 0;

  return wsRes(ws).success("Moved index");
};
