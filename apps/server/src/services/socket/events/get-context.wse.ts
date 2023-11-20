import type { GetContextEvent } from "prs-types";

//? rename to updateContextEvent? or requestContext
export const getContext: GetContextEvent = async ({ ws, req }) => {
  return ws.broadcast(["revalidateContext", req.context]);
};
