"use client";

import { useParams } from "next/navigation";
import { AlignLeft, SaveIcon, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Card } from "@/types";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UpdateCard } from "@/schemas/card-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DescriptionProps {
  data: Card;
}

export const Description = ({ data }: DescriptionProps) => {
  const params = useParams();
  const update = useMutation(api.cards.update);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string | undefined>(
    data.description || "Add a more detailed description..."
  );

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      title: data.title,
      description: data.description,
      boardId: params.boardId as Id<"boards">,
      id: data._id,
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

  const onSubmit = (values: z.infer<typeof UpdateCard>) => {
    setIsEditing(false);

    if (values.description === description) {
      return;
    }

    setDescription(values.description);

    const promise = update({
      title: values.title,
      description: values.description,
      boardId: params.boardId as Id<"boards">,
      id: values.id as Id<"cards">,
    });

    toast.promise(promise, {
      loading: "Updating card...",
      success: "Card updated!",
      error: "Failed to update card.",
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

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] mb-2 bg-neutral-200" />
      </div>
    </div>
  );
};
