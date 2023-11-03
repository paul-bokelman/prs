import type { UpdateCurrentTaskEvent } from "prs-types";
import { prisma } from "../../../config";
import { context } from "../../../lib/context";
import { wsu } from "../../../lib/utils";

export const updateCurrentTaskEvent: UpdateCurrentTaskEvent = async (
  { ws, req },
  { currentTaskId, currentTaskIndex }
) => {
  if (!currentTaskId) return wsu(ws).error("No currentTaskId provided");
  if (currentTaskIndex === undefined) return wsu(ws).error("No currentTaskIndex provided");
  if (currentTaskIndex < 0) return wsu(ws).error("Invalid currentTaskIndex");
  req.context.currentId = currentTaskId;
  req.context.currentIndex = currentTaskIndex;
  await context.set(req.context);
  return wsu(ws).success("Updated current task");
};
