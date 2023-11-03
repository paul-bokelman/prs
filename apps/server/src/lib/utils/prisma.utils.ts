import type { Day, Task } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "../../config";

export const getDay = async (incomingDate: Date | string = new Date()): Promise<(Day & { tasks: Task[] }) | null> => {
  const date = dayjs(incomingDate);
  const startOfDay = date.startOf("day").toDate();
  const endOfDay = date.endOf("day").toDate();

  try {
    const day = await prisma.day.findFirstOrThrow({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      include: { tasks: true },
    });

    day.tasks.sort((t1, t2) => {
      // should this be in controller?
      if (t1.complete) return 1;
      if (t2.complete) return -1;
      return 0;
    });

    return day;
  } catch (e) {
    return null;
  }
};

export const getCurrentTaskByIndex = async (currentIndex: number): Promise<Task | null> => {
  const day = await getDay();
  if (!day) return null;
  console.log(day.tasks);
  return day.tasks[currentIndex];
};

export const prismaUtils = { getDay, getCurrentTaskByIndex };
