"use client";

import { useOrganization } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const BoardNavbar = ({
  isCollapsed,
  onResetWidth,
}: BoardNavbarProps) => {
  const { organization } = useOrganization();
  const params = useParams();

  const parsedId = params.boardId as Id<"boards">;

  const board = useQuery(api.boards.getById, {
    id: parsedId,
    orgId: organization?.id!,
  });

  if (board === undefined) {
    return <BoardNavbar.Skeleton />;
  }

  if (board === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-black/50 w-full flex items-center px-4 gap-x-4 h-14">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}

        <div className="flex items-center justify-between w-full">
          <BoardTitleForm data={board} />
          <div className="ml-auto">
            <BoardOptions id={board._id} />
          </div>
        </div>
      </nav>
    </>
  );
};

BoardNavbar.Skeleton = function BoardNavbarSkeleton() {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 flex items-center justify-between px-6 gap-x-4 text-white">
      <Skeleton className="h-7 w-14" />
      <Skeleton className="h-8 w-8" />
    </div>
  );
};
