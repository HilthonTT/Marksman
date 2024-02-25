"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ItemProps {
  label: string;
  icon?: LucideIcon;
  imageUrl?: string;
  href: string;
}

export const Item = ({ label, icon: Icon, href, imageUrl }: ItemProps) => {
  const pathname = usePathname();

  const active = href === pathname;

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
            className="object-cover rounded-full"
            fill
          />
        </div>
      )}
      {Icon && (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
};
