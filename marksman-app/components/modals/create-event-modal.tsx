"use client";

import { CheckIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { CreateEvent } from "@/schemas/event-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateEventModal = () => {
  const { organization } = useOrganization();
  const modal = useModal((state) => state);

  const isOpen = modal.isOpen && modal.type === "createEvent";

  const form = useForm<z.infer<typeof CreateEvent>>({
    resolver: zodResolver(CreateEvent),
    defaultValues: {
      title: "",
      orgId: organization?.id,
    },
  });

  const handleClose = () => {
    form.reset();
    modal.onClose();
  };

  const onSubmit = (values: z.infer<typeof CreateEvent>) => {
    // Submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogTitle className="font-semibold leading-6 flex items-center gap-2">
          <h3>Add an event</h3>
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
                className="w-full border-neutral-300 border hover:bg-neutral-100 transition">
                Cancel
              </Button>
              <Button type="submit" className="w-full" variant="secondary">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
