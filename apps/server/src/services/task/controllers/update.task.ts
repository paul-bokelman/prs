import type { Task } from "@prisma/client";
import type { Controller } from "~/types";
import { TaskStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface UpdateTask {
  args: z.infer<typeof schema>;
  payload: Task;
}

const schema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    description: z.string().optional(),
    points: z.number().optional(),
    priority: z
      .number()
      .refine((n) => n >= 0 && n <= 10, "Priority must be from 0 to 10")
      .optional(),
  }),
});

const handler: Controller<UpdateTask> = async (req, res) => {
  const { success, error } = formatResponse<UpdateTask>(res);
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, select: { id: true, userId: true } });
    if (!task) return error(StatusCodes.NOT_FOUND, "No task associated with that ID");
    if (task.userId !== req.user.id) return error(StatusCodes.BAD_REQUEST, "You can only delete your own tasks");
    const updatedTask = await prisma.task.update({ where: { id: task.id }, data: req.body });
    return success(StatusCodes.CREATED, updatedTask);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const updateTask = { handler, schema };
