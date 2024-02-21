"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/spinner";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-full">{children}</div>
  );
};

export default ClerkLayout;
