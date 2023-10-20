import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getTimeToNextDay = (currentTime: number): string => {
  const now = new Date(currentTime);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const timeToNextDay = tomorrow.getTime() - now.getTime();

  // describe the line below
  const hours = Math.floor(timeToNextDay / (1000 * 60 * 60)); // 1000ms * 60s * 60m
  const minutes = Math.floor((timeToNextDay / (1000 * 60)) % 60); // 1000ms * 60s
  const seconds = Math.floor((timeToNextDay / 1000) % 60); // 1000ms

  const formattedTime = [hours, minutes, seconds].map((value) => {
    if (value < 10) return `0${value}`;
    return value;
  });

  return formattedTime.join(":");
};
