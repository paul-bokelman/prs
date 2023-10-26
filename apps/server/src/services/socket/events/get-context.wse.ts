import type { GetContextEvent } from "prs-types";

// can and should replace updateCurrentTaskEvent (bc it's part of context)

export const getContext: GetContextEvent = async ({ req }) => {
  return req.context;
};
