import { useState } from "react";
import {
  useToast,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Input,
  Button,
} from "@/components/ui";
import { Loader } from "lucide-react";

interface Props {
  open: boolean;
  close: () => void;
  taskTitle: string;
  updateTask: (taskTitle: string) => void;
}

export const EditTaskDialog: React.FC<Props> = ({ taskTitle: initialTaskTitle, open, close, updateTask }) => {
  const { toast } = useToast();
  const [taskTitle, setTaskTitle] = useState<string>(initialTaskTitle);
  const loading = false;

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleSubmit = () => {
    if (!taskTitle || typeof taskTitle !== "string" || taskTitle === initialTaskTitle) {
      toast({ title: "Invalid Task Title", variant: "destructive" });
      return;
    }

    updateTask(taskTitle);
    return close();
  };

  return (
    <Dialog open={open} defaultOpen={false}>
      <DialogContent onEscapeKeyDown={close} onInteractOutside={close}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit the title and date of this task.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          <Label htmlFor="name" className="text-left">
            Task Title
          </Label>
          <Input id="name" value={taskTitle} onChange={handleTaskTitleChange} className="col-span-3" />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!taskTitle || taskTitle === initialTaskTitle || loading}>
            {!loading ? (
              "Save Changes"
            ) : (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
