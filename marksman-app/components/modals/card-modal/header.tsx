"use client";

import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { LayoutIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UpdateCard } from "@/schemas/card-schemas";
import { Card, ListWithCards } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  data: Card;
  list: ListWithCards;
}

export const Header = ({ data, list }: HeaderProps) => {
  const inputRef = useRef<ElementRef<"input">>(null);

  const params = useParams();
  const update = useMutation(api.cards.update);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      title: data.title,
      description: data.description,
      boardId: params.boardId as Id<"boards">,
      id: data._id,
    },
  });

  const [title, setTitle] = useState<string>(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (values: z.infer<typeof UpdateCard>) => {
    if (values.title === title) {
      return;
    }

    setTitle(values.title);

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

  return (
    <div className="flex items-start justify-start gap-x-3 mb-6 w-full">
      <LayoutIcon className="h-5 w-5 mt-1 text-neutral-700" />
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
                      className="font-semibold text-xl px-1 h-7 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-inherit mb-0.5 truncate transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="text-xs text-muted-foreground">
              Part of &quot;{list.title}&quot; list.
            </span>
          </form>
        </Form>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
