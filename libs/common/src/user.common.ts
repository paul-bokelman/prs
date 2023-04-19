import type { User } from '@prisma/client';
import { z } from 'zod';

export type AuthenticatedUser = User; // abstracted bc can be expanded

/* -------------------------------- GET USERS ------------------------------- */

export interface GetUsers {
  args: undefined;
  payload: Array<Pick<User, 'id' | 'name' | 'points'>>;
}

/* -------------------------------- GET USER -------------------------------- */

export interface GetUser {
  args: undefined;
  payload: AuthenticatedUser;
}

/* ------------------------------- CREATE USER ------------------------------ */

export interface CreateUser {
  args: z.infer<typeof createUserValidation>;
  payload: User;
}

export const createUserValidation = z.object({
  body: z.object({
    name: z.string(),
    pin: z.number().refine((n) => n.toString().length === 4, 'PIN must be 4 digits'),
  }),
});

/* ------------------------------- DELETE USER ------------------------------ */

export interface DeleteUser {
  args: undefined;
  payload: undefined;
}

/* ------------------------------- UPDATE USER ------------------------------ */

export interface UpdateUser {
  args: z.infer<typeof updateUserValidation>;
  payload: User;
}

export const updateUserValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    pin: z
      .number()
      .refine((n) => n.toString().length === 4, 'PIN must be 4 digits')
      .optional(),
    points: z.number().optional(),
  }),
});
