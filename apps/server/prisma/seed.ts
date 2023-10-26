import { PrismaClient } from "@prisma/client";
import { generateTasksData } from "./seed-data/tasks-data";
import { context } from "../src/lib";
const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.task.deleteMany();
    await prisma.task.createMany({ data: generateTasksData() });
    await context.destroy();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
