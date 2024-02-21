"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const Hero = () => {
  return (
    <div className="relative">
      <div className="flex items-center justify-center max-w-5xl">
        <Image
          src="/hero.jpg"
          alt="Hero"
          width={300}
          height={300}
          className="object-cover rounded-full"
        />
      </div>
      <div className="absolute bottom-0 right-4">
        <Badge className="bg-emerald-500 hover:bg-emerald-400 text-white">
          Verified by our investors
        </Badge>
      </div>
    </div>
  );
};
