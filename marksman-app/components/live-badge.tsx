"use client";

import { Badge } from "@/components/ui/badge";

interface LiveBadgeProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const LiveBadge = ({ className, onClick }: LiveBadgeProps) => {
  return (
    <Badge
      onClick={onClick}
      className="bg-emerald-500 uppercase tracking-wide text-[8px] px-1 py-0 hover:bg-emerald-400">
      Active
    </Badge>
  );
};
