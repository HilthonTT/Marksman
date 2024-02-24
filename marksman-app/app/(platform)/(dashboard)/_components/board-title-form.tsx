"use client";

import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateBoard } from "@/schemas/board-schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BoardTitleFormProps {
  data: Doc<"boards">;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const router = useRouter();
  const { organization } = useOrganization();

  const update = useMutation(api.boards.update);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UpdateBoard>>({
    resolver: zodResolver(UpdateBoard),
    defaultValues: {
      title: data.title,
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (values: z.infer<typeof UpdateBoard>) => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = update({
      id: data._id,
      title: values.title,
      orgId: organization.id,
    }).then(() => {
      disableEditing();
    });

    toast.promise(promise, {
      loading: "Updating title...",
      success: `Updated title to "${values.title}"!`,
      error: "Failed to update title.",
    });
  };

  if (isEditing) {
    return (
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
                    onBlur={form.handleSubmit(onSubmit)}
                    className="focus-visible:ring-transparent font-bold py-1 h-7"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      className="h-auto w-auto p-1 px-2 font-bold text-lg text-white"
      variant="ghost">
      {data.title}
    </Button>
  );
};
