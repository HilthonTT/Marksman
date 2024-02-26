"use client";

import { useMutation } from "convex/react";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Event } from "@/types";
import { useModal } from "@/hooks/use-modal";

interface ActionsProps {
  data: Event;
}

export const Actions = ({ data }: ActionsProps) => {
  const modal = useModal((state) => state);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const remove = useMutation(api.events.remove);

  const onDelete = async () => {
    setIsDeleting(true);

    try {
      await remove({ id: data._id });

      modal.onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold text-black">Actions</p>
      <Button
        onClick={onDelete}
        disabled={isDeleting}
        size="sm"
        className="w-full justify-start">
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 flex-shrink-0 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash className="h-4 w-4 mr-2 flex-shrink-0" />
            Trash
          </>
        )}
      </Button>
    </div>
  );
};
