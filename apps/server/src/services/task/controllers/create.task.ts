import type { Task } from "@prisma/client";
import type { Controller } from "~/types";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface CreateTask {
  args: z.infer<typeof schema>;
  payload: Task;
}

const schema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    points: z.number(),
    priority: z
      .number()
      .refine((n) => n >= 0 && n <= 10, "Priority must be from 0 to 10")
      .optional(),
  }),
});

const handler: Controller<CreateTask> = async (req, res) => {
  const { success } = formatResponse<CreateTask>(res);
  try {
    const task = await prisma.task.create({ data: { user: { connect: { id: req.user.id } }, ...req.body } });
    return success(StatusCodes.CREATED, task);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const createTask = { handler, schema };
