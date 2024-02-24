"use client";

import { z } from "zod";
import { useMutation } from "convex/react";
import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { CreateList } from "@/schemas/list-schemas";
import { Id } from "@/convex/_generated/dataModel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ListForm = () => {
  const { organization } = useOrganization();

  const router = useRouter();
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const create = useMutation(api.lists.create);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CreateList>>({
    resolver: zodResolver(CreateList),
    defaultValues: {
      title: "",
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
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

  const onSubmit = (values: z.infer<typeof CreateList>) => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = create({
      orgId: organization.id,
      title: values.title,
      boardId: params.boardId as Id<"boards">,
    }).then(() => {
      form.reset();
      disableEditing();
    });

    toast.promise(promise, {
      loading: "Creating list...",
      success: "List created!",
      error: "Failed to create list.",
    });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <li className="shrink-0 h-full w-[272px] select-none">
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-3 rounded bg-white space-y-4 shadow-md">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-sm px-2 py-1 h-7 font-medium border-transparent bg-transparent hover:border-input focus:border-input transition text-black"
                      placeholder="Enter list title..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-1">
              <Button type="submit" size="sm">
                Add list
              </Button>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                aria-label="Cancel">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </li>
    );
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm text-black">
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </li>
  );
};
