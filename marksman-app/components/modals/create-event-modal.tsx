"use client";

import { CheckIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { CreateEventForm } from "@/schemas/event-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export const CreateEventModal = () => {
  const modal = useModal((state) => state);
  const create = useMutation(api.events.create);

  const { start, allDay, orgId } = modal.data;

  const isOpen = modal.isOpen && modal.type === "createEvent";

  const form = useForm<z.infer<typeof CreateEventForm>>({
    resolver: zodResolver(CreateEventForm),
    defaultValues: {
      title: "",
    },
  });

  const handleClose = () => {
    form.reset();
    modal.onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof CreateEventForm>) => {
    const promise = create({
      orgId: orgId as string,
      title: values.title,
      start: start?.getTime() as number,
      allDay: allDay as boolean,
    }).then(() => {
      handleClose();
    });

    toast.promise(promise, {
      loading: "Creating event...",
      success: "Event created!",
      error: "Failed to create event.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogTitle className="font-semibold leading-6 flex items-center gap-2">
          Add an event
          <CheckIcon className="h-5 w-5" />
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Enter the event title..."
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full border-neutral-300 border hover:bg-neutral-100 transition">
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                variant="secondary"
                disabled={isLoading}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
