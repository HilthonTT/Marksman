"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ItemProps {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
}

export const Item = ({ label, icon: Icon, active, onClick }: ItemProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: "12px" }}
      className={cn(
        "group min-[32px] text-sm p-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium transition",
        active && "bg-primary/5 text-primary"
      )}>
      <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
};
