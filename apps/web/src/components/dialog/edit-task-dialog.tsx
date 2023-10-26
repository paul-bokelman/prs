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
  taskDescription: string;
  updateTask: (taskDescription: string) => void;
}

export const EditTaskDialog: React.FC<Props> = ({
  taskDescription: initialTaskDescription,
  open,
  close,
  updateTask,
}) => {
  const { toast } = useToast();
  const [taskDescription, setTaskDescription] = useState<string>(initialTaskDescription);
  const loading = false;

  const handleTaskDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(e.target.value);
  };

  const handleSubmit = () => {
    if (!taskDescription || typeof taskDescription !== "string" || taskDescription === initialTaskDescription) {
      toast({ title: "Invalid Task Title", variant: "destructive" });
      return;
    }

    updateTask(taskDescription);
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
          <Input id="name" value={taskDescription} onChange={handleTaskDescriptionChange} className="col-span-3" />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!taskDescription || taskDescription === initialTaskDescription || loading}
          >
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
