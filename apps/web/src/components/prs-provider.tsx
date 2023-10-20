import { TaskMode } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { qc } from "@/lib/api";

// PRS Context (plan out)

type PRSProviderProps = {
  children: React.ReactNode;
};

type PRSProviderState = {
  active: boolean;
  currentTaskIndex: number;
  taskMode: TaskMode;
};

const initialState: PRSProviderState = {
  active: false,
  currentTaskIndex: 0,
  taskMode: TaskMode.DEFAULT,
};

const PRSProviderContext = createContext<PRSProviderState>(initialState);

export function PRSProvider({ children, ...props }: PRSProviderProps) {
  const [active, setActive] = useState<boolean>(false);

  const value: PRSProviderState = {
    active,
    currentTaskIndex: 0,
    taskMode: TaskMode.DEFAULT,
  };

  socket.on("confirm:success", () => {
    qc.invalidateQueries("tasks");
  });

  // socket.on("prs:active", (active: boolean) => {
  //   setActive(active);
  // })

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
