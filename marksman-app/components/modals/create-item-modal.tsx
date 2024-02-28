"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { CreateItem } from "@/schemas/item-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export const CreateItemModal = () => {
  const modal = useModal((state) => state);

  const create = useMutation(api.items.create);

  const form = useForm<z.infer<typeof CreateItem>>({
    resolver: zodResolver(CreateItem),
    defaultValues: {
      name: "",
    },
  });

  const isOpen = modal.type === "createItem" && modal.isOpen;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof CreateItem>) => {
    const promise = create({
      ...values,
    }).then(() => {
      form.reset();
      modal.onClose();
    });

    toast.promise(promise);
  };

  return (
    <Dialog open={isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Name*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 space-y-2">
              <div className="flex items-center justify-between col-span-2">
                <FormField
                  name="quantity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Quantity*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="minLevel"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Min Level"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between col-span-2">
                <FormField
                  name="price"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <FormField
              name="imageUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                className="bg-black text-white hover:bg-black/80">
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
