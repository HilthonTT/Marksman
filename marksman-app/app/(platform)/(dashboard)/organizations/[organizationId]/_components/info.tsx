"use client";

import Image from "next/image";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard, Recycle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Info = () => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <Info.Skeleton />;
  }

  const size = 80;

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl flex items-center justify-center p-4">
        <Image
          className="object-cover rounded-md"
          width={size}
          height={size}
          src={organization?.imageUrl!}
          alt="Organization"
        />
        <div className="space-y-1 ml-3 flex flex-col">
          <span className="text-lg lg:text-xl font-semibold dark:text-neutral-300 text-neutral-600 truncate">
            {organization?.name}
          </span>
          <div className="flex items-center text-xs text-muted-foreground">
            <CreditCard className="h-3 w-3 mr-1" />
            {true ? "Pro" : "Free"}
          </div>
        </div>
        <Button
          className="ml-auto truncate font-medium"
          variant="secondary"
          asChild>
          <Link href="/select-org">
            <Recycle className="h-6 w-6 mr-2" />
            Change Organization
          </Link>
        </Button>
      </div>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl flex items-center justify-center p-4">
        <Skeleton className="w-[80px] h-[80px] rounded-md" />
        <div className="space-y-1 ml-3 flex flex-col">
          <Skeleton className="w-[100px] h-6" />
          <div className="flex items-center text-xs text-muted-foreground">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 w-[30px]" />
          </div>
        </div>
        <Skeleton className="ml-auto h-10 w-52" />
      </div>
    </div>
  );
};
