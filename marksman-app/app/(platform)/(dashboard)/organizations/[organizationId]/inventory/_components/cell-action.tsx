"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ArrowRightCircle, MenuIcon, TrashIcon } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import { Billboard } from "./columns";

interface CellActionsProps {
  data: Billboard;
}

export const CellActions = ({ data }: CellActionsProps) => {
  const router = useRouter();
  const { organization } = useOrganization();

  const remove = useMutation(api.billboards.remove);

  const onRemove = () => {
    if (!organization) {
      return router.push("/select-org");
    }

    const promise = remove({
      id: data._id,
      orgId: organization.id,
    });

    toast.promise(promise, {
      loading: "Deleting billboard...",
      success: "Billboard deleted!",
      error: "Failed to delete billboard.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="Open Menu">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="space-y-2">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem className="cursor-pointer">
          <Link
            href={`/billboard/${data._id}`}
            className="flex items-center justify-center">
            <ArrowRightCircle className="h-4 w-4 mr-2" />
            Visit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={onRemove}>
          <TrashIcon className="h-4 w-4 mr-2 " />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
