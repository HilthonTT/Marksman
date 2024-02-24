"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Plus, X } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CreateCard } from "@/schemas/card-schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface CardFormProps {
  listId: Id<"lists">;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const create = useMutation(api.cards.create);

    const form = useForm<z.infer<typeof CreateCard>>({
      resolver: zodResolver(CreateCard),
      defaultValues: {
        title: "",
        listId: listId as Id<"lists">,
        boardId: params.boardId as Id<"boards">,
      },
    });

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef?.current?.requestSubmit();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    const onSubmit = (values: z.infer<typeof CreateCard>) => {
      const promise = create({
        title: values.title,
        listId: values.listId as Id<"lists">,
        boardId: values.boardId as Id<"boards">,
      }).then(() => {
        form.reset();
        disableEditing();
      });

      toast.promise(promise, {
        loading: "Creating card...",
        success: "Card created!",
        error: "Failed to create card.",
      });
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    if (isEditing) {
      return (
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-1 py-0.5 px-1 space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      ref={ref}
                      placeholder="Enter a title for this card..."
                      className="font-medium border-transparent bg-transparent hover:border-input focus:border-input transition text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input readOnly hidden id="listId" value={listId} />
            <input readOnly hidden id="boardId" value={params.boardId} />
            <div className="flex items-center gap-x-1">
              <Button size="sm" type="submit">
                Add card
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={disableEditing}
                aria-label="Cancel">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      );
    }

    return (
      <div className="p-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          variant="ghost"
          size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
