"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { ElementRef, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

import { ListWithCards } from "@/types";
import { UpdateList } from "@/schemas/list-schemas";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface ListHeaderProps {
  data: ListWithCards;
  onAddCard: () => void;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
  const { organization } = useOrganization();

  const router = useRouter();
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const update = useMutation(api.lists.update);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UpdateList>>({
    resolver: zodResolver(UpdateList),
    defaultValues: {
      title: data.title,
      id: data._id,
      boardId: params.boardId as Id<"boards">,
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (values: z.infer<typeof UpdateList>) => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = update({
      orgId: organization.id,
      id: data._id,
      title: values.title,
      boardId: params.boardId as Id<"boards">,
    }).then(() => {
      disableEditing();
    });

    toast.promise(promise, {
      loading: "Updating list...",
      success: "List updated!",
      error: "Failed to update list.",
    });
  };

  const onBlur = () => {
    formRef?.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter") {
      formRef?.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex items-start justify-between gap-x-2 text-black">
      {isEditing ? (
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 px-[2px]">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      ref={inputRef}
                      placeholder="Enter list title..."
                      className="text-sm px-2 py-1 h-7 font-medium border-transparent bg-transparent hover:border-input focus:border-input transition text-black"
                      onBlur={onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input readOnly hidden id="boardId" value={data.board} />
            <input readOnly hidden id="id" value={data._id} />
          </form>
        </Form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h--7 font-medium border-transparent">
          {data.title}
        </div>
      )}
    </div>
  );
};
