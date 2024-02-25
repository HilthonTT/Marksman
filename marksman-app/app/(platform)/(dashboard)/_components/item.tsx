"use client";

import Image from "next/image";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ItemProps {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  image?: string;
  onClick: () => void;
}

export const Item = ({
  label,
  icon: Icon,
  active,
  onClick,
  image,
}: ItemProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: "12px" }}
      className={cn(
        "group min-[32px] text-sm p-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium transition",
        active && "bg-primary/5 text-primary"
      )}>
      {image && (
        <div className="relative h-[24px] w-[24px] shrink-0 mr-2">
          <Image
            src={image}
            alt="Image"
            className="rounded-full object-cover shrink-0"
            fill
          />
        </div>
      )}
      {Icon && (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
};
