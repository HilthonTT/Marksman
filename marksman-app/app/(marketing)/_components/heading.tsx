"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight, DoorOpen } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Collaborate, communicate and plan your work!
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Welcome to <span className="underline font-bold">Marksman</span>, mark
        your work.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/select-org">
            <DoorOpen className="mr-2 h-4 w-4" />
            Enter Marksman
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton>
          <Button>
            <ArrowRight className="h-4 w-4 mr-2" />
            Mark your debut
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
