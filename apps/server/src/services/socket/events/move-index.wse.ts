import type { MoveIndexEvent } from "prs-types";
import { prisma } from "../../../config";
import { wsu } from "../../../lib/utils";
import { context } from "../../../lib/context";

export const moveIndexEvent: MoveIndexEvent = async ({ ws, req }, { direction }) => {
  const { currentIndex, maxIndex } = req.context;
  let newIndex = 0;
  let nextIndex = currentIndex + (direction === "left" ? -1 : 1);
  if (nextIndex < 0) {
    newIndex = maxIndex;
  } else if (nextIndex > maxIndex) {
    newIndex = 0;
  } else {
    newIndex = nextIndex;
  }

  // ? Update currentIndex and currentId in context

  req.context.currentIndex = newIndex;
  await context.set(req.context);

  return wsu(ws).success(["revalidateContext", req.context]);
};
