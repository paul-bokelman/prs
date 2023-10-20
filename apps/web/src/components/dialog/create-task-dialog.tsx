import { ServerError, CreateTask } from "prs-types";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { api, qc } from "@/lib/api";
import { sfx } from "@/lib/sfx";

interface Props {
  open: boolean;
  close: () => void;
}

const formSchema = z.object({
  title: z.string().max(50, "Too long").min(3, "Too short"),
  due: z.date().nullable(),
  complete: z.boolean().default(false),
  order: z.number().default(0),
  reoccurring: z.boolean().default(false),
});

export const CreateTaskDialog: React.FC<Props> = ({ open, close }) => {
  const { toast } = useToast();

  const createTask = useMutation<CreateTask["payload"], ServerError, { data: CreateTask["body"] }>({
    mutationFn: ({ data }) => api.tasks.create(data),
    onSuccess: () => {
      qc.invalidateQueries("tasks");
      sfx.success.play();
    },
    onError: () => {
      toast({ title: "Failed to create task", variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      due: new Date(),
      complete: false,
      order: 0,
      reoccurring: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTask.mutate({ data });
    close();
  };

  useEffect(() => {
    if (open) {
      form.reset();
      sfx.click.play();
    }
  }, [open, form]);

  return (
    <Dialog open={open} defaultOpen={false}>
      <DialogContent onEscapeKeyDown={close} onInteractOutside={close}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit the title and date of this task.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
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
