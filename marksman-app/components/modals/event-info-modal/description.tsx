"use client";

import { AlignLeft, SaveIcon, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Event } from "@/types";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UpdateEvent } from "@/schemas/event-schemas";

interface DescriptionProps {
  data: Event;
}

export const Description = ({ data }: DescriptionProps) => {
  const update = useMutation(api.events.update);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string | undefined>(
    data.description || "Add a more detailed description..."
  );

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const form = useForm<z.infer<typeof UpdateEvent>>({
    resolver: zodResolver(UpdateEvent),
    defaultValues: {
      title: data.title,
      description: data.description,
      id: data._id,
      start: data.start,
    },
  });

  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const onSubmit = (values: z.infer<typeof UpdateEvent>) => {
    setIsEditing(false);

    if (values.description === description) {
      return;
    }

    setDescription(values.description);

    const promise = update({
      title: values.title,
      description: values.description,
      id: values.id as Id<"events">,
      start: values.start,
    });

    toast.promise(promise, {
      loading: "Updating event...",
      success: "Event updated!",
      error: "Failed to update event.",
    });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700 flex-shrink-0" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing && (
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        className="font-medium border-white bg-transparent focus-visible:ring-transparent hover:border-input focus:border-input transition text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2 mt-2">
                <Button
                  size="sm"
                  type="submit"
                  className="hover:bg-neutral-200 transition">
                  <SaveIcon className="h-5 w-5 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={disableEditing}
                  size="sm"
                  type="button"
                  className="hover:bg-neutral-200 transition"
                  aria-label="Cancel">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        {!isEditing && (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 hover:bg-neutral-200/80 transition text-sm font-medium py-3 px-3.5 rounded-md text-black">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
