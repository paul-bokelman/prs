import type { ConfirmEvent } from "prs-types";
import { prisma } from "../../../config";
import { wsu } from "../../../lib/utils";

export const confirmEvent: ConfirmEvent = async ({ ws, req }) => {
  const { currentId, mode } = req.context;

  if (!currentId) return wsu(ws).error("No task id present");
  if (!mode) return wsu(ws).error("No mode present");
  if (!["default", "delete"].includes(mode)) return wsu(ws).error("Invalid mode");

  const task = await prisma.task.findUnique({ where: { id: currentId } });
  if (!task) return wsu(ws).error("Task not found");
  if (mode === "default") {
    await prisma.task.update({ where: { id: currentId }, data: { complete: { set: !task.complete } } });
    return wsu(ws).success(["confirmed", { taskId: task.id }]);
  }

  await prisma.task.delete({ where: { id: currentId } });
  return wsu(ws).success("Deleted task");
};
