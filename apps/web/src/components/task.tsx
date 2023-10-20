import { useEffect, useState } from "react";
import type { GetTasks, ServerError, UpdateTask, DeleteTask } from "prs-types";
import cn from "clsx";
import { useMutation } from "react-query";
import { TaskMode } from "@/types";
import { EditTaskDialog } from "@/components/dialog";
import { useToast } from "@/components/ui";
import { Circle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { api, qc } from "@/lib/api";
import { sfx } from "@/lib/sfx";
import { socket } from "@/lib/socket";

type Props = GetTasks["payload"][number] & {
  mode: TaskMode;
};

export const Task: React.FC<Props> = ({ mode, ...task }) => {
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [onHover, setOnHover] = useState<boolean>(false);

  const { id, title, due, complete } = task;

  const { mutate: updateTaskMutation } = useMutation<
    UpdateTask["payload"],
    ServerError,
    { id: string; data: UpdateTask["body"] }
  >({
    mutationFn: ({ id, data }) => api.tasks.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries("tasks");
    },
    onError: () => {
      toast({ title: "Failed to update task", variant: "destructive" });
    },
  });

  const { mutate: deleteTaskMutation } = useMutation<DeleteTask["payload"], ServerError, string>({
    mutationFn: (id) => api.tasks.delete(id),
    onSuccess: () => {
      qc.invalidateQueries("tasks");
    },
    onError: () => {
      toast({ title: "Failed to delete task", variant: "destructive" });
    },
  });

  const closeEditDialog = () => setEditDialogOpen(false);
  const completeTask = () => {
    updateTaskMutation({ id, data: { complete: !complete } });
    sfx.complete().play();
  };

  const editTask = () => {
    setEditDialogOpen(true);
    // edit modal
  };

  const deleteTask = () => {
    deleteTaskMutation(id);
    sfx.delete().play();
  };

  const handleInteraction = () => {
    if (mode === TaskMode.DEFAULT) return completeTask();
    if (mode === TaskMode.EDIT) return editTask();
    if (mode === TaskMode.DELETE) return deleteTask();
  };

  useEffect(() => {
    if (onHover) {
      sfx.select.play();
    }
  }, [onHover]);

  return (
    <>
      <div
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
        className="flex flex-col cursor-pointer hover:bg-accent/50 px-4 py-2 rounded-lg group"
        onClick={handleInteraction}
      >
        <div className="grid grid-cols-2 items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">{title}</h3>
            </div>
            <p className="leading-7 text-muted-foreground text-xs">
              {new Date(due!).toDateString()} •{" "}
              <span className={cn({ "text-green-500/80": complete, "text-orange-500/80": !complete })}>
                {complete ? "Complete" : "Incomplete"}
              </span>
            </p>
          </div>
          <div className="hidden group-hover:flex place-self-end self-center mr-6">
            {mode === TaskMode.DEFAULT &&
              (complete ? (
                <Circle className="text-orange-500/80" size={20} />
              ) : (
                <CheckCircle2 className="text-green-500/80" size={20} />
              ))}
            {mode === TaskMode.EDIT && <Pencil className="text-blue-500/80" size={20} />}
            {mode === TaskMode.DELETE && <Trash2 className="text-red-500/80" size={20} />}
          </div>
        </div>
      </div>
      <EditTaskDialog
        open={editDialogOpen}
        close={closeEditDialog}
        taskTitle={title}
        updateTask={(title: string) => updateTaskMutation({ id, data: { title } })}
      />
    </>
  );
};
