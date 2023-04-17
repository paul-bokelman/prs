import type { User } from "@prisma/client";
import type { Controller } from "~/types";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface CreateUser {
  args: z.infer<typeof schema>;
  payload: User;
}

const schema = z.object({
  body: z.object({
    name: z.string(),
    pin: z.number().refine((n) => n.toString().length === 4, "PIN must be 4 digits"),
  }),
});

const handler: Controller<CreateUser> = async (req, res) => {
  const { success, error } = formatResponse<CreateUser>(res);
  try {
    const existingUser = await prisma.user.findUnique({ where: { pin: req.body.pin } });
    if (existingUser) return error(StatusCodes.BAD_REQUEST, "A user with that PIN already exists");
    const user = await prisma.user.create({ data: req.body });
    return success(StatusCodes.CREATED, user);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const createUser = { handler, schema };
