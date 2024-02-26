"use client";

import Link from "next/link";
import { HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <>
      <Separator className="my-4" />
      <div className="flex items-center gap-1">
        <Button variant="link" asChild>
          <Link href="/">
            <HomeIcon className="h-5 w-5 mr-2" />
            Home
          </Link>
        </Button>
      </div>
    </>
  );
};
