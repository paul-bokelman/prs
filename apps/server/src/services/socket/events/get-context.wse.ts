import type { GetContextEvent } from "prs-types";

// can and should replace updateCurrentTaskEvent (bc it's part of context)
//? rename to updateContextEvent? or requestContext
export const getContext: GetContextEvent = async ({ ws, req }) => {
  return ws.broadcast(["revalidateContext", req.context]);
};
