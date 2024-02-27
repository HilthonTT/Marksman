"use client";

import { useOrganization } from "@clerk/nextjs";
import { notFound, redirect, usePathname } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BoardLayoutProps {
  params: {
    boardId: Id<"boards">;
  };
  children: React.ReactNode;
}

const BoardLayout = ({ params, children }: BoardLayoutProps) => {
  const pathname = usePathname();
  const { organization } = useOrganization();

  if (!organization) {
    return redirect("/select-org");
  }

  const board = useQuery(api.boards.getById, {
    orgId: organization?.id!,
    id: params.boardId,
  });

  if (board === undefined) {
    return null;
  }

  if (board === null) {
    return notFound();
  }

  const isConference = pathname.includes("/conference");

  if (isConference) {
    return (
      <div className="relative h-full w-full">
        <main className="h-full relative">{children}</main>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}>
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardLayout;
