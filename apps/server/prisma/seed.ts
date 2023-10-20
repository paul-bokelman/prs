import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { generateTasksData } from "./seed-data/tasks-data";

(async () => {
  try {
    await prisma.task.deleteMany();

    await prisma.task.createMany({
      data: generateTasksData(),
    });

    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
