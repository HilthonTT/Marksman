import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { BoardList } from "./_components/board-list";
import { Info } from "./_components/info";

const OrganizationIdPage = () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  return (
    <div className="w-full">
      <Info />
      <div className="px-2 md:px-4">
        <BoardList orgId={orgId} />
      </div>
    </div>
  );
};

export default OrganizationIdPage;
