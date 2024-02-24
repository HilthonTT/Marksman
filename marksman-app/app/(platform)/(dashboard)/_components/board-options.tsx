"use client";

import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";
import { MoreHorizontal, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BoardOptionsProps {
  id: Id<"boards">;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const router = useRouter();

  const { organization } = useOrganization();

  const remove = useMutation(api.boards.remove);

  const onDelete = () => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = remove({
      orgId: organization.id,
      id,
    });

    toast.promise(promise, {
      loading: "Deleting board...",
      success: "Deleted board",
      error: "Failed to delete board.",
    });

    router.push(`/organizations/${organization.id}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-auto p-2"
          aria-label="Options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3 bg-white"
        side="bottom"
        align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose>
          <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-black">
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onDelete}
          className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-neutral-200 transition font-normal text-sm text-black">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};
