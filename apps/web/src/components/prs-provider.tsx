import type {
  PRSContext,
  ServerToClientEvents,
  ConfirmedEvent,
  MovedIndexEvent,
  InitializeClientEvent,
  PRSOnlineEvent,
} from "prs-types";
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
  setCurrentTaskId: (id: string) => void;
  currentMode: Exclude<TaskMode, TaskMode.EDIT>;
  setCurrentMode: (mode: Exclude<TaskMode, TaskMode.EDIT>) => void;
  currentTaskIndex: number;
  taskMode: TaskMode;
};

const initialState: PRSProviderState = {
  online: false,
  currentMode: TaskMode.DEFAULT,
  currentTaskId: "",
  setCurrentTaskId: () => {},
  setCurrentMode: () => {},
  currentTaskIndex: 0,
  taskMode: TaskMode.DEFAULT,
};

const PRSProviderContext = createContext<PRSProviderState>(initialState);

export function PRSProvider({ children, ...props }: PRSProviderProps) {
  const [online, setOnline] = useState<boolean>(true);
  const [wsOpen, setWsOpen] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<Exclude<TaskMode, TaskMode.EDIT>>(TaskMode.DEFAULT);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [eventExecuted, setEventExecuted] = useState<boolean>(false);

  // when the index is moved by the user, the server context needs to be updated
  const movedIndexEvent: MovedIndexEvent = ({ newIndex }) => {
    sfx.select.play();
    setCurrentTaskIndex(newIndex);
  };

  // when the current task is updated by the user, the server context needs to be updated
  const confirmedEvent: ConfirmedEvent = ({ taskId }) => {
    // ideally use setQuery then invalidateQueries
    sfx.complete().play();
    qc.invalidateQueries("currentDay");
  };

  // on server connect, initialize client state
  const initializeClientEvent: InitializeClientEvent = (context: PRSContext) => {
    setCurrentTaskId(context.currentId);
    setCurrentTaskIndex(context.currentIndex);
    setCurrentMode(context.mode as Exclude<TaskMode, TaskMode.EDIT>); // change default type
  };

  const prsOnlineEvent: PRSOnlineEvent = (online: boolean) => {
    setOnline(online);
  };

  const events = {
    movedIndex: movedIndexEvent,
    confirmed: confirmedEvent,
    initializeClient: initializeClientEvent,
    prsOnline: prsOnlineEvent,
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      const [event, args] = data as [
        keyof ServerToClientEvents,
        ServerToClientEvents[keyof ServerToClientEvents]["arguments"], // TODO: fix this
      ];

      if (event in events) events[event](args);
      setEventExecuted(true);
    } catch (err) {
      // not valid JSON
      console.log(e.data);
    }
  };

  ws.addEventListener("open", () => {
    setWsOpen(true);
    ws.addEventListener("close", () => setWsOpen(false));
  });

  //! remove when testing with physical system
  useEffect(() => {
    setOnline(wsOpen); // will need to change to detect physical system not just server
  }, [wsOpen]);

  useEffect(() => {
    if (wsOpen && eventExecuted) {
      ws.send(JSON.stringify(["updateCurrentTask", { currentTaskId, currentTaskIndex }]));
      setEventExecuted(false);
    }
  }, [currentTaskId, currentTaskIndex, wsOpen, eventExecuted]);

  const value: PRSProviderState = {
    online,
    currentTaskIndex,
    currentTaskId,
    currentMode,
    setCurrentTaskId,
    setCurrentMode,
    taskMode: TaskMode.DEFAULT,
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
