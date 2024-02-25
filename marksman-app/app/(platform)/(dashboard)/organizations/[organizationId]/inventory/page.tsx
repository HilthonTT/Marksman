import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { BillBoardsList } from "./_components/billboards-list";

const InventoryPage = () => {
  const { userId, orgId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  if (!orgId) {
    return redirect("/select-org");
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardsList orgId={orgId} />
      </div>
    </div>
  );
};

export default InventoryPage;
