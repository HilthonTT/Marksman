"use client";

import Image from "next/image";
import { useOrganization } from "@clerk/clerk-react";
import { CreditCard } from "lucide-react";
import { useQuery } from "convex/react";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

export const OrgItem = () => {
  const { organization, isLoaded } = useOrganization();

  const isPro = useQuery(api.subscriptions.check, {
    orgId: organization?.id as string,
  });

  if (!isLoaded || isPro === undefined) {
    return <OrgItem.Skeleton />;
  }

  return (
    <div className="flex items-center gap-x-4 p-2">
      <div className="w-[50px] h-[50px] relative">
        <Image
          fill
          src={organization?.imageUrl!}
          alt="Organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1 relative">
        <p className="font-semibold text-base text-start truncate max-w-[140px]">
          {organization?.name}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3 mr-1" />
          {isPro ? "Pro" : "Free"}
        </div>
      </div>
    </div>
  );
};

OrgItem.Skeleton = function OrgItemSkeleton() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  );
};
