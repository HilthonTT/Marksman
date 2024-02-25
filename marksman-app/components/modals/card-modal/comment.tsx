"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { Comment as CommentType } from "@/types";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentProps {
  comment: CommentType;
}

export const Comment = ({ comment }: CommentProps) => {
  const user = useUser(comment.userId);

  return (
    <div className="space-y-2 text-black">
      <div className="flex items-start justify-start">
        {!user ? (
          <Skeleton className="h-8 w-8 bg-neutral-200 rounded-full" />
        ) : (
          <div className="relative h-8 w-8">
            <Image
              src={user.imageUrl}
              alt="Image"
              className="object-cover rounded-full"
              fill
            />
          </div>
        )}
        <div className="space-x-2 flex items-center">
          {!user ? (
            <Skeleton className="h-4 w-12 bg-neutral-200 ml-2" />
          ) : (
            <p className="text-sm font-semibold ml-2 truncate capitalize">
              {user?.username}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="bg-neutral-200 rounded-lg p-3 max-w-xs">
        <p className="break-words text-sm">{comment.comment}</p>
      </div>
    </div>
  );
};
