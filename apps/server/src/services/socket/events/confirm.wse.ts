import type { ConfirmEvent } from "prs-types";
import { prisma } from "../../../config";
import { wsRes } from "../socket-events";

export const confirmEvent: ConfirmEvent = async ({ ws, req }, { taskId, mode }) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return wsRes(ws).error("Task not found");
  if (mode === "default") {
    await prisma.task.update({ where: { id: taskId }, data: { complete: { set: !task.complete } } });
    return wsRes(ws).success("Changed task status");
  }

  await prisma.task.delete({ where: { id: taskId } });
  return wsRes(ws).success("Deleted task");
};
