import type { User } from "@prisma/client";
import type { Controller } from "~/types";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { formatResponse, handleControllerError } from "~/lib/utils";
import { prisma } from "~/config";

interface UpdateUser {
  args: z.infer<typeof schema>;
  payload: User;
}

const schema = z.object({
  body: z.object({
    name: z.string().optional(),
    pin: z
      .number()
      .refine((n) => n.toString().length === 4, "PIN must be 4 digits")
      .optional(),
    points: z.number().optional(),
  }),
});

const handler: Controller<UpdateUser> = async (req, res) => {
  const { success } = formatResponse<UpdateUser>(res);
  const user = req.user;
  try {
    const updatedUser = await prisma.user.update({ where: { pin: user.pin }, data: req.body });
    return success(StatusCodes.OK, updatedUser);
  } catch (e) {
    handleControllerError(e, res);
  }
};

export const updateUser = { handler, schema };
