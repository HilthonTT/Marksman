"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal";

import { SearchInput } from "./search-input";
import { Info } from "./info";

interface InventoryProps {
  orgId: string;
}

export const Inventory = ({ orgId }: InventoryProps) => {
  const modal = useModal((state) => state);

  const onClick = () => {
    modal.onOpen("createItem");
  };

  return (
    <div className="flex flex-col p-10">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold">All Items</h1>
          <Button onClick={onClick} className="uppercase font-bold p-4">
            Add Item
          </Button>
        </div>
      </div>

      <Separator className="my-4" />
      <div className="flex items-center justify-between mb-4">
        <SearchInput />
      </div>
      <Info orgId={orgId} />
    </div>
  );
};
