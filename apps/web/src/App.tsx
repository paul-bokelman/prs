import { TaskMode } from "@/types";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import cn from "clsx";
import dayjs from "dayjs";
import { Plus, CalendarDays, ArrowRight } from "lucide-react";
import { Task } from "@/components";
import { Button, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { CreateTaskDialog } from "@/components/dialog";
import { getTimeToNextDay } from "@/lib/utils";
import { api, qc } from "@/lib/api";
import { sfx } from "@/lib/sfx";
import { socket } from "@/lib/socket";

interface Props {}

const App: React.FC<Props> = () => {
  const [prsOnline, setPrsOnline] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [taskMode, setTaskMode] = useState<TaskMode>(TaskMode.DEFAULT);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  const { data: tasks, status } = useQuery("tasks", () => api.tasks.getMany(dayjs().format("YYYY-MM-DD")));

  const changeTaskMode = (mode: string) => {
    const currentMode = TaskMode[mode.toUpperCase() as keyof typeof TaskMode];
    if (currentMode === taskMode) return;
    setTaskMode(currentMode);
    sfx.click.play();
  };

  const closeCreateDialog = () => setCreateDialogOpen(false);

  const stats = {
    streak: 2,
    totalTasksCompleted: 7,
  };

  // const confirmEvent = (id: string) => {
  //   socket.emit("confirm", { taskId: id, mode: "default" });
  //   qc.invalidateQueries("tasks");
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((currentTime) => currentTime + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (status !== "success") return <div>stat</div>;

  return (
    <>
      <div className="relative w-screen h-screen flex flex-col gap-2 p-20">
        <div className="relative flex flex-col">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Physical Reward System</h1>
          <p className="leading-7 text-muted-foreground mt-4">
            Here's everything you gotta do to stay on track. You got this! 🚀
          </p>
        </div>

        <div className="relative flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Tabs defaultValue="default" onValueChange={changeTaskMode} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="delete">Delete</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            {tasks.map((task, i) => (
              <span
                key={i}
                className={cn(
                  { "text-muted": task.complete, "text-muted-foreground": !task.complete },
                  "flex items-center gap-1 text-xs"
                )}
              >
                {task.title} {tasks.length > i + 1 && <ArrowRight size={12} />}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3">
            {tasks.map((task, i) => (
              <Task key={i} {...task} mode={taskMode} />
            ))}
          </div>
          {/* <div className="flex items-center gap-2">
            {tasks.map((task) => (
              <button onClick={() => confirmEvent(task.id)}>{task.title}</button>
            ))}
          </div> */}
        </div>
        <div className="absolute bottom-20 left-20 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={cn({ "bg-green-500": prsOnline, "bg-red-500": !prsOnline }, "h-2 w-2 rounded-full")} />
            <p className="text-xs italic leading-7 text-muted-foreground">
              PRS system {prsOnline ? "online" : "offline"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[`⚡️ ${stats.streak}`, `🏆 ${stats.totalTasksCompleted}`].map((value) => (
              <span key={value} className="text-xs leading-7 text-muted-foreground">
                {value}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{getTimeToNextDay(currentTime)}</span>
        </div>
      </div>
      <CreateTaskDialog open={createDialogOpen} close={closeCreateDialog} />
    </>
  );
};

export default App;
