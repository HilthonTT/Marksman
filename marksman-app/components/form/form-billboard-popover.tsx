"use client";

import { z } from "zod";
import { X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateBillboard } from "@/schemas/billboard-schemas";
import { api } from "@/convex/_generated/api";

interface FormBillboardPopoverProps {
  orgId: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormBillboardPopover = ({
  orgId,
  children,
  side,
  align,
  sideOffset,
}: FormBillboardPopoverProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const create = useMutation(api.billboards.create);

  const form = useForm<z.infer<typeof CreateBillboard>>({
    resolver: zodResolver(CreateBillboard),
    defaultValues: {
      title: "",
      orgId,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateBillboard>) => {
    const promise = create({
      title: values.title,
      orgId,
    }).then(() => {
      form.reset();
      closeRef.current?.click();
    });

    toast.promise(promise, {
      loading: "Creating billboard...",
      success: "Billboard created!",
      error: "Failed to create billboard.",
    });
  };

  const isLoading = form.formState.isSubmitting;

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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-bold">Board Title</Label>
                    <FormControl>
                      <Input
                        {...field}
                        className="focus-visible:ring-transparent"
                        placeholder="Enter a billboard title"
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
