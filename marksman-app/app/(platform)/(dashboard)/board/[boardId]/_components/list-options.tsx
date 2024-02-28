"use client";

import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CopyIcon, MoreHorizontal, PlusIcon, TrashIcon, X } from "lucide-react";
import { ElementRef, useRef } from "react";

import { api } from "@/convex/_generated/api";
import { ListWithCards } from "@/types";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ListOptionsProps {
  data: ListWithCards;
  onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const router = useRouter();

  const remove = useMutation(api.lists.remove);
  const copy = useMutation(api.lists.copy);

  const { organization } = useOrganization();

  const onDelete = () => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = remove({ orgId: organization.id, id: data._id });

    toast.promise(promise, {
      loading: "Deleting list...",
      success: "List deleted!",
      error: "Failed to delete list.",
    });
  };

  const onCopy = () => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = copy({ orgId: organization.id, id: data._id });

    toast.promise(promise, {
      loading: "Copying list...",
      success: "List copied!",
      error: "Failed to copy list.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-auto h-auto p-2" aria-label="Options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white px-0 pt-3 pb-3 border-none"
        side="bottom"
        align="start">
        <div className="text-sm font-medium text-center text-neutral-600">
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="w-auto h-auto absolute top-2 right-2 p-2 bg-transparent text-black hover:bg-neutral-200"
            aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto px-5 p-2 justify-start font-normal text-sm bg-white text-black hover:bg-neutral-200 transition">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add card...
        </Button>
        <Button
          onClick={onCopy}
          className="rounded-none w-full h-auto px-5 p-2 justify-start font-normal text-sm bg-white text-black hover:bg-neutral-200 transition">
          <CopyIcon className="h-4 w-4 mr-2" />
          Copy list
        </Button>
        <Button
          onClick={onDelete}
          className="rounded-none w-full h-auto px-5 p-2 justify-start font-normal text-sm bg-white text-black hover:bg-neutral-200 transition">
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete list
        </Button>
      </PopoverContent>
    </Popover>
  );
};
