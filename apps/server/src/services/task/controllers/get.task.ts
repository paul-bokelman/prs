import type { Task } from "@prisma/client";
import type { Controller } from "~/types";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface GetTask {
  args: z.infer<typeof schema>;
  payload: Task & { user: { id: string } };
}

const schema = z.object({
  params: z.object({ id: z.string() }),
});

const handler: Controller<GetTask> = async (req, res) => {
  const { success, error } = formatResponse<GetTask>(res);
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true } } },
    });
    if (!task) return error(StatusCodes.BAD_REQUEST, "No task associated with that ID");
    if (task.user.id !== req.user.id) return error(StatusCodes.UNAUTHORIZED, "You can only get your own tasks");
    return success(StatusCodes.OK, task);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTask = { handler, schema };
