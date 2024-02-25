"use client";

import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Copy, Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useCardModal } from "@/hooks/use-card-modal";
import { Card } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ActionsProps {
  data: Card;
}

export const Actions = ({ data }: ActionsProps) => {
  const router = useRouter();
  const cardModal = useCardModal();

  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { organization } = useOrganization();

  const copy = useMutation(api.cards.copy);
  const remove = useMutation(api.cards.remove);

  const onCopy = async () => {
    setIsCopying(true);

    try {
      await copy({ id: data._id });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCopying(false);
    }
  };

  const onDelete = async () => {
    if (!organization) {
      return router.push("/select-org");
    }

    setIsDeleting(true);

    try {
      await remove({ orgId: organization?.id, id: data._id });

      cardModal.onClose();
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
        onClick={onCopy}
        disabled={isCopying}
        size="sm"
        className="w-full justify-start">
        {isCopying ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 flex-shrink-0 animate-spin" />
            Copying...
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2 flex-shrink-0" />
            Copy
          </>
        )}
      </Button>
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

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="h-4 w-16 bg-neutral-200" />

      <Skeleton className="h-6 w-24 bg-neutral-200" />
      <Skeleton className="h-6 w-24 bg-neutral-200" />
    </div>
  );
};
