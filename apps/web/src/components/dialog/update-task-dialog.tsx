import type { UpdateTask, ServerError } from "prs-common";
import * as React from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { schemas } from "prs-common";
import { usePRS } from "@/components/prs-provider";
import { api } from "@/lib/api";
import {
  useToast,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
import { Loader } from "lucide-react";

interface Props {
  task: { id: string; description: string };
  open: boolean;
  close: () => void;
}

const schema = schemas.task.update.shape.body;

export const UpdateTaskDialog: React.FC<Props> = ({ task, open, close }) => {
  const { revalidateContext } = usePRS();
  const { toast } = useToast();

  const updateTask = useMutation<UpdateTask["payload"], ServerError, { id: string; data: UpdateTask["body"] }>({
    mutationFn: ({ id, data }) => api.tasks.update(id, data),
    onSuccess: () => revalidateContext(),
    onError: () => {
      toast({ title: "Failed to update task", variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { description: task.description },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await updateTask.mutateAsync({ id: task.id, data });
    close();
  };

  // hate this block...
  React.useEffect(() => {
    form.setValue("description", task.description);
  }, [form, task]);

  return (
    <Dialog open={open} defaultOpen={false}>
      <DialogContent onEscapeKeyDown={close} onInteractOutside={close}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit the description and date of this task.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder={formState.defaultValues?.description} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={updateTask.isLoading}>
                {updateTask.isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};