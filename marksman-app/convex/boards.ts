import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

import { CreateBoard } from "../schemas/board-schemas";

export const getAll = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const boards = await ctx.db
      .query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();

    return boards;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    image: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateBoard.safeParseAsync({
      title: args.title,
      image: args.image,
    });

    if (!result.success) {
      throw new Error("Invalid input data");
    }

    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUsername] =
      args.image.split("|");

    if (
      !imageId ||
      !imageThumbUrl ||
      !imageFullUrl ||
      !imageLinkHTML ||
      !imageUsername
    ) {
      throw new Error("Missing fields. Failed to create board");
    }

    const board = await ctx.db.insert("boards", {
      title: args.title,
      imageId,
      imageFullUrl,
      imageLinkHTML,
      imageThumbUrl,
      orgId: args.orgId,
    });

    return board;
  },
});
