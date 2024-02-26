"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex items-center w-full p-6 bg-background dark:bg-[#1C1C1C] z-50 text-muted-foreground">
      <p className="text-xs w-full">©{currentYear} Marksman Corporation</p>
      <div className="md:ml-auto md:justify-end w-full justify-between flex items-center gap-x-2 ">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/policy">Privacy Policy</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/terms">Terms & Conditions</Link>
        </Button>
      </div>
    </div>
  );
};
