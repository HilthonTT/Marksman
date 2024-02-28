"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { LiveBadge } from "@/components/live-badge";

interface ItemProps {
  label: string;
  icon?: LucideIcon;
  imageUrl?: string;
  isLive?: boolean;
  href: string;
}

export const Item = ({
  label,
  icon: Icon,
  href,
  imageUrl,
  isLive,
}: ItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const active = href === pathname;

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    router.push(`${href}/conference`);
  };

  return (
    <Link
      href={href}
      className={cn(
        "group min-[32px] text-sm p-2 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium transition pl-[12px]",
        active && "bg-primary/5 text-primary"
      )}>
      {imageUrl && (
        <div className="shrink-0 h-[24px] w-[24px] mr-2 relative">
          <Image
            src={imageUrl}
            alt="Image"
            className={cn(
              "object-cover rounded-full",
              isLive && "ring-2 ring-emerald-500 border border-background"
            )}
            fill
          />
          {isLive && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <LiveBadge onClick={onClick} />
            </div>
          )}
        </div>
      )}
      {Icon && (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
};
