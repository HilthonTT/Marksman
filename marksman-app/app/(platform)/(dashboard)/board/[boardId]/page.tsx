import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Id } from "@/convex/_generated/dataModel";

import { ListContainer } from "./_components/list-container";

interface BoardPageProps {
  params: {
    boardId: Id<"boards">;
  };
}

const BoardPage = ({ params }: BoardPageProps) => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} />
    </div>
  );
};

export default BoardPage;
