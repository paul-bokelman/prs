import type { ServerToClientEvents, PRSOnlineEvent, RevalidateContextEvent } from "prs-types";
import * as React from "react";
import { TaskMode } from "@/types";
import { ws } from "@/lib/socket";
import { qc } from "@/lib/api";

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type PRSProviderProps = {
  children: React.ReactNode;
};

type PRSProviderState = {
  online: boolean;
  currentTaskId: string;
  currentMode: Exclude<TaskMode, TaskMode.EDIT>;
  currentTaskIndex: number;
  taskMode: TaskMode;
  setCurrentTaskId: (id: string) => void;
  setCurrentMode: (mode: Exclude<TaskMode, TaskMode.EDIT>) => void;
  revalidateContext: () => void;
};

const initialState: PRSProviderState = {
  online: false,
  currentMode: TaskMode.DEFAULT,
  currentTaskId: "",
  currentTaskIndex: 0,
  taskMode: TaskMode.DEFAULT,
  setCurrentTaskId: () => {},
  setCurrentMode: () => {},
  revalidateContext: () => {},
};

const PRSProviderContext = React.createContext<PRSProviderState>(initialState);

export function PRSProvider({ children, ...props }: PRSProviderProps) {
  const [online, setOnline] = React.useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = React.useState<string>("");
  const [currentMode, setCurrentMode] = React.useState<Exclude<TaskMode, TaskMode.EDIT>>(TaskMode.DEFAULT);
  const [currentTaskIndex, setCurrentTaskIndex] = React.useState<number>(0);

  const revalidateContext: PRSProviderState["revalidateContext"] = () => {
    ws.dispatch(["getContext"]);
  };

  const revalidateContextEvent: RevalidateContextEvent = (ctx) => {
    //? play sound on confirm? (requires action name prs->server->client)
    setCurrentTaskId(ctx.currentId as string);
    setCurrentTaskIndex(ctx.currentIndex as number);
    setCurrentMode(ctx.mode as Exclude<TaskMode, TaskMode.EDIT>);
    qc.invalidateQueries("currentDay");
  };

  const prsOnlineEvent: PRSOnlineEvent = (online: boolean) => {
    setOnline(online);
  };

  const events = {
    prsOnline: prsOnlineEvent,
    revalidateContext: revalidateContextEvent,
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      const [event, args] = data as [
        keyof ServerToClientEvents,
        UnionToIntersection<Parameters<ServerToClientEvents[keyof ServerToClientEvents]>[number]>
      ];

      if (event in events) events[event](args);
    } catch (err) {
      console.log(e.data);
    }
  };

  const value: PRSProviderState = {
    online,
    currentTaskIndex,
    currentTaskId,
    currentMode,
    taskMode: TaskMode.DEFAULT,
    setCurrentTaskId,
    setCurrentMode,
    revalidateContext,
  };

  return (
    <PRSProviderContext.Provider {...props} value={value}>
      {children}
    </PRSProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePRS = () => {
  const context = React.useContext(PRSProviderContext);
  if (context === undefined) throw new Error("usePRS must be used within a PRSProvider");
  return context;
};
