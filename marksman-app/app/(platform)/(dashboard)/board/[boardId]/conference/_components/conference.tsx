"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MediaRoom } from "@/components/media-room";
import { Spinner } from "@/components/spinner";

interface ConferenceProps {
  id: Id<"boards">;
  orgId: string;
}

export const Conference = ({ id, orgId }: ConferenceProps) => {
  const router = useRouter();
  const board = useQuery(api.boards.getById, { id, orgId });

  const onDisconnected = () => {
    router.push(`/board/${board?._id}`);
  };

  if (board === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full">
      <MediaRoom
        roomId={board?._id as string}
        title={board?.title}
        onDisconnected={onDisconnected}
      />
    </div>
  );
};
