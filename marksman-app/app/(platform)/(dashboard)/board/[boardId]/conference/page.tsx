import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Id } from "@/convex/_generated/dataModel";
import { Conference } from "./_components/conference";

interface BoardConferencePageProps {
  params: {
    boardId: Id<"boards">;
  };
}

const BoardConferencePage = async ({ params }: BoardConferencePageProps) => {
  const { orgId, userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  if (!orgId) {
    return redirect("/select-org");
  }

  return (
    <div className="h-full w-full">
      <Conference id={params.boardId} orgId={orgId} />
    </div>
  );
};

export default BoardConferencePage;
