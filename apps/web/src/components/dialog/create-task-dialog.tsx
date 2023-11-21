import type { ServerError, CreateTask } from "prs-common";
import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { schemas } from "prs-common";
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
import { api } from "@/lib/api";
import { sfx } from "@/lib/sfx";
import dayjs from "dayjs";
import { usePRS } from "..";

interface Props {
  open: boolean;
  close: () => void;
}

const schema = schemas.task.create.shape.body;

export const CreateTaskDialog: React.FC<Props> = ({ open, close }) => {
  const { toast } = useToast();
  const { revalidateContext } = usePRS();
  const [params] = useSearchParams(location.search);

  const createTask = useMutation<CreateTask["payload"], ServerError, { data: CreateTask["body"] }>({
    mutationFn: ({ data }) => api.tasks.create(data),
    onSuccess: () => {
      revalidateContext();
      sfx.success.play();
    },
    onError: () => {
      toast({ title: "Failed to create task", variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      complete: false,
      reoccurring: false,
      day: dayjs(params.get("date")).format("YYYY-MM-DD"),
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await createTask.mutateAsync({ data });
    close();
  };

  React.useEffect(() => {
    if (open) {
      form.reset();
      sfx.click.play();
    }
  }, [open, form]);

  return (
    <Dialog open={open} defaultOpen={false}>
      <DialogContent onEscapeKeyDown={close} onInteractOutside={close}>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create a new task with a description</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Math HW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
