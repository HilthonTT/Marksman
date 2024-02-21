"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

export const Navbar = () => {
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        "z-50  bg-background dark:bg-[#1C1C1C] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <Button variant="ghost" size="sm">
          Login
        </Button>

        <Button variant="ghost" size="sm">
          <Link href="/organizations">Enter Marksman</Link>
        </Button>

        <ModeToggle />
      </div>
    </nav>
  );
};
