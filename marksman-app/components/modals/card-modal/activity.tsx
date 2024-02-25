"use client";

import Image from "next/image";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { BarChartHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { CardWithComments } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CreateComment } from "@/schemas/comment-schemas";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Comment } from "./comment";

interface ActivityProps {
  card: CardWithComments;
}

export const Activity = ({ card }: ActivityProps) => {
  const { user } = useUser();

  const create = useMutation(api.comments.create);

  const form = useForm<z.infer<typeof CreateComment>>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      comment: "",
      cardId: card._id,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof CreateComment>) => {
    console.log("Submit");

    const promise = create({
      comment: values.comment,
      cardId: values.cardId as Id<"cards">,
    }).then((comment) => {
      form.reset();

      if (comment) {
        card.comments.push(comment);
      }
    });

    toast.promise(promise, {
      loading: "Commenting...",
      success: "Commented!",
      error: "Failed to comment.",
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <div className="flex items-center justify-center flex-col">
        <BarChartHorizontal className="h-5 w-5 mt-0.5 text-neutral-700 flex-shrink-0" />
        <div className="flex items-center justify-start space-x-2">
          <div className="relative h-8 w-8 mt-4">
            <Image
              src={user?.imageUrl!}
              alt="Profile Image"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="comment"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-start">
                      <Input
                        {...field}
                        className="bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0 text-black rounded-xl max-w-xs"
                        placeholder="Write a comment..."
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <ScrollArea className="mt-4 h-[420px] pr-6">
          <div className="space-y-4">
            {card.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
