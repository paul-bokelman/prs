import { PrismaClient, Day, Task } from "@prisma/client";
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import { context } from "../src/lib";
const prisma = new PrismaClient();

type CreateTaskArgs = Omit<Task, "id" | "createdAt" | "updatedAt">;

(async () => {
  try {
    await prisma.task.deleteMany();
    await prisma.day.deleteMany();

    let days: Day[] = [];

    for (let i = -3; i < 3; i++) {
      const date = dayjs().add(i, "day").toDate();
      days.push(await prisma.day.create({ data: { date } }));
    }

    for (const day of days) {
      const tasks: Array<CreateTaskArgs> = [];

      for (let i = 0; i < 5; i++) {
        const task: CreateTaskArgs = {
          description: faker.lorem.words(3),
          reoccurring: faker.datatype.boolean(),
          dayId: day.id,
          complete: faker.datatype.boolean(),
        };

        tasks.push(task);
      }

      await prisma.task.createMany({ data: tasks });
    }

    // await context.destroy();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
