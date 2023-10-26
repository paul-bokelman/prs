import type { PRSContext } from "prs-types";
import fs from "fs";

const CONTEXT_FILE = "./context.json";

export const setContext = async (context: PRSContext) => {
  await fs.promises.writeFile(CONTEXT_FILE, JSON.stringify(context));
};

export const getContext = async (): Promise<PRSContext> => {
  const context = await fs.promises.readFile(CONTEXT_FILE, "utf-8");
  return JSON.parse(context) as PRSContext;
};

export const destroyContext = async () => {
  if (!fs.existsSync(CONTEXT_FILE)) return;
  await fs.promises.unlink(CONTEXT_FILE);
};

export const initializeContext = async (initialContext?: PRSContext) => {
  if (fs.existsSync(CONTEXT_FILE)) return;
  try {
    await fs.promises.writeFile(CONTEXT_FILE, JSON.stringify(initialContext));
    return await getContext();
  } catch (error) {
    console.log("Failed to create context file: ", error);
  }
};

export const context = {
  init: initializeContext,
  set: setContext,
  get: getContext,
  destroy: destroyContext,
};
