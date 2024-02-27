"use client";

import { z } from "zod";
import { ElementRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateBoard } from "@/schemas/board-schemas";
import { useModal } from "@/hooks/use-modal";

import { FormPicker } from "./form-picker";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side,
  align,
  sideOffset,
}: FormPopoverProps) => {
  const router = useRouter();
  const modal = useModal((state) => state);
  const { organization } = useOrganization();

  const closeRef = useRef<ElementRef<"button">>(null);

  const create = useMutation(api.boards.create);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CreateBoard>>({
    resolver: zodResolver(CreateBoard),
    defaultValues: {
      title: "",
      image: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateBoard>) => {
    if (!organization) {
      return router.push("/select-org");
    }

    setIsSubmitting(true);

    const promise = create({
      title: values.title,
      image: values.image,
      orgId: organization?.id!,
    })
      .then((boardId: string) => {
        setIsSubmitting(false);
        form.reset();
        closeRef?.current?.click();
        router.push(`/board/${boardId}`);
      })
      .catch((error) => {
        modal.onOpen("pro");
        closeRef?.current?.click();

        throw new Error(error);
      });

    toast.promise(promise, {
      loading: "Creating a new board...",
      success: "New board created!",
      error: "Failed to create a new board.",
    });
  };

  const isLoading = form.formState.isLoading;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}>
        <div className="text-sm font-medium text-center text-neutral-200 pb-4">
          Create board
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormPicker
                        onChange={field.onChange}
                        isSubmitting={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-bold">Board Title</Label>
                    <FormControl>
                      <Input
                        {...field}
                        className="focus-visible:ring-transparent"
                        placeholder="Enter a board title"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={isLoading}>
              Create
            </Button>
          </form>
        </Form>
      </PopoverContent>
      <PopoverClose ref={closeRef} asChild>
        <Button
          className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
          variant="ghost"
          disabled={isLoading}>
          <X className="h-4 w-4" />
        </Button>
      </PopoverClose>
    </Popover>
  );
};
