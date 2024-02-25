"use client";

import { useQuery } from "convex/react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { FormBillboardPopover } from "@/components/form/form-billboard-popover";

import { columns } from "./columns";

interface BillBoardsListProps {
  orgId: string;
}

export const BillBoardsList = ({ orgId }: BillBoardsListProps) => {
  const billboards = useQuery(api.billboards.getAll, { orgId });

  const onNew = () => {
    // Open modal
  };

  if (billboards === undefined) {
    return <BillBoardsList.Skeleton />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h2 className="font-bold text-3xl">
            Billboards ({billboards?.length})
          </h2>
          <p>Manage billboards for your organization</p>
        </div>

        <FormBillboardPopover
          orgId={orgId}
          side="left"
          sideOffset={20}
          align="start">
          <Button size="sm" variant="ghost">
            <Plus onClick={onNew} className="h-4 w-4 mr-2 " />
            Add new
          </Button>
        </FormBillboardPopover>
      </div>
      <Separator className="my-1" />
      <DataTable columns={columns} data={billboards} searchKey="title" />
    </>
  );
};

BillBoardsList.Skeleton = function BillBoardsListSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="w-full space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="h-12 w-12" />
      </div>
    </>
  );
};
