"use client";

import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
}

export const LiveBadge = ({ className }: LiveBadgeProps) => {
  return (
    <div
      className={cn(
        "bg-rose-500 text-center rounded-md uppercase text-[10px] tracking-wide text-white p-0.5 px-1",
        className
      )}>
      Active
    </div>
  );
};
