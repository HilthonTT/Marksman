"use client";

import { useQuery } from "convex/react";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

interface InfoProps {
  orgId: string;
}

export const Info = ({ orgId }: InfoProps) => {
  const items = useQuery(api.items.getAll, { orgId });

  if (items === undefined) {
    return <Info.Skeleton />;
  }

  return (
    <div className="gap-4 flex items-center justify-start">
      <div className="space-x-2">
        <span className="text-muted-foreground text-lg">Items:</span>
        <span>{items?.items?.length}</span>
      </div>
      <div className="space-x-2">
        <span className="text-muted-foreground text-lg">Total Quantity:</span>
        <span>{items?.totalQuantity} units</span>
      </div>
      <div className="space-x-2">
        <span className="text-muted-foreground text-lg">Total Value:</span>
        <span>{items?.totalPrice} &euro;</span>
      </div>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="gap-4 flex items-center justify-start">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-24" />
      ))}
    </div>
  );
};
