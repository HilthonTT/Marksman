"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { CalendarClock } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Event } from "@/types";
import { UpdateEvent } from "@/schemas/event-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface HeaderProps {
  data: Event;
}

export const Header = ({ data }: HeaderProps) => {
  const inputRef = useRef<ElementRef<"input">>(null);

  const update = useMutation(api.events.update);

  const form = useForm<z.infer<typeof UpdateEvent>>({
    resolver: zodResolver(UpdateEvent),
    defaultValues: {
      title: data.title,
      id: data._id,
      start: data.start,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof UpdateEvent>) => {
    const promise = update({
      title: values.title,
      id: values.id as Id<"events">,
      start: values.start,
    });

    toast.promise(promise);
  };

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  return (
    <div className="flex items-start justify-start gap-x-3 mb-6 w-full">
      <CalendarClock className="h-6 w-6 " />
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      ref={inputRef}
                      onBlur={onBlur}
                      disabled={isLoading}
                      className="font-semibold text-xl px-1 h-7 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-inherit mb-0.5 truncate transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-xs text-muted-foreground">
              Event on the {new Date(data.start).toLocaleDateString()}
            </span>
          </form>
        </Form>
      </div>
    </div>
  );
};
