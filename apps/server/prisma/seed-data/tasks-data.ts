import type { Task } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

type CreateTaskArgs = Omit<Task, "id" | "createdAt" | "updatedAt">;

export const generateTasksData = (): Array<CreateTaskArgs> => {
  const tasks: Array<CreateTaskArgs> = [];

  for (let i = 0; i < 25; i++) {
    const complete = faker.datatype.boolean();
    const day = faker.number.int({ max: 3, min: -1 });

    const dueDate = dayjs().endOf("day").add(day, "day").toDate();

    const task: CreateTaskArgs = {
      title: faker.lorem.words(3),
      reoccurring: faker.datatype.boolean(),
      due: dueDate,
      order: i,
      complete,
    };

    tasks.push(task);
  }

  return tasks;
};
