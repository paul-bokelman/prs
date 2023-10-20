import { PrismaClient } from "@prisma/client";
import { env } from "../lib";

interface Global {
  prisma: PrismaClient;
}

const prisma =
  (global as unknown as Global).prisma ||
  (new PrismaClient({
    log: ["warn", "error"],
    datasources: { db: { url: env("DATABASE_URL") } },
  }) as PrismaClient);

(global as unknown as Global).prisma = prisma;

export { prisma };
