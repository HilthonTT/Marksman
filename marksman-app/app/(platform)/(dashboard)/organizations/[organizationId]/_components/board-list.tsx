"use client";

import Link from "next/link";
import { HelpCircle, User2 } from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";

interface BoardListProps {
  orgId: string;
}

export const BoardList = ({ orgId }: BoardListProps) => {
  const boards = useQuery(api.boards.getAll, { orgId });

  if (boards === undefined) {
    return <BoardList.Skeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-200">
        <User2 className="h-6 w-6" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards?.map((board) => (
          <Link
            key={board._id}
            href={`/board/${board._id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        <FormPopover side="right" sideOffset={10}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {true ? "Unlimited" : `${5 - 0} remaining`}
            </span>
            <Hint
              sideOffset={40}
              description={`
              Marksman allows you to have up to 5 boards. For unlimited amount of boards, please consider our subscription.
          `}>
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="aspect-video w-full h-full p-2" />
      ))}
    </div>
  );
};
