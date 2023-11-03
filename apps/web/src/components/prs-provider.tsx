import type { ServerToClientEvents, PRSOnlineEvent, RevalidateContextEvent } from "prs-types";
import { TaskMode } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { ws } from "@/lib/socket";
import { qc } from "@/lib/api";
import { sfx } from "@/lib/sfx";

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

const PRSProviderContext = createContext<PRSProviderState>(initialState);

export function PRSProvider({ children, ...props }: PRSProviderProps) {
  const [online, setOnline] = useState<boolean>(true);
  const [wsOpen, setWsOpen] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<Exclude<TaskMode, TaskMode.EDIT>>(TaskMode.DEFAULT);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  const revalidateContext = () => {
    ws.dispatch(["getContext"]);
  };

  const revalidateContextEvent: RevalidateContextEvent = (ctx) => {
    // todo: insure args are not null
    //? play sound on confirm?
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
        ServerToClientEvents[keyof ServerToClientEvents]["arguments"],
      ];

      if (event in events) events[event](args);
    } catch (err) {
      // invalid json (just message?)
      console.log(e.data);
    }
  };

  ws.addEventListener("open", () => {
    setWsOpen(true);
    ws.addEventListener("close", () => setWsOpen(false));
  });

  // todo: remove when testing with physical system
  useEffect(() => {
    setOnline(wsOpen); // will need to change to detect physical system not just server
  }, [wsOpen]);

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

export const usePRS = () => {
  const context = useContext(PRSProviderContext);
  if (context === undefined) throw new Error("usePRS must be used within a PRSProvider");
  return context;
};
