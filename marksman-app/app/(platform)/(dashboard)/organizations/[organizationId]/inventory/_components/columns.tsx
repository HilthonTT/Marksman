"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";

import { CellActions } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Billboard = {
  _id: Id<"billboards">;
  title: string;
  orgId: string;
  _creationTime: number;
};

export const columns: ColumnDef<Billboard>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "_creationTime",
    header: "Date",
    cell: ({ row }) => (
      <>{new Date(row.original._creationTime).toLocaleDateString()}</>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
