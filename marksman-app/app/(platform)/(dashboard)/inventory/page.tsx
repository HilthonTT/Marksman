import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Inventory } from "./_components/inventory";

const InventoryPage = () => {
  const { orgId, userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  if (!orgId) {
    return redirect("/select-org");
  }

  return <Inventory orgId={orgId} />;
};

export default InventoryPage;
