import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

import { CreateBoard, UpdateBoard } from "../schemas/board-schemas";

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

export const getById = query({
  args: {
    orgId: v.string(),
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Not found");
    }

    return board;
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

export const update = mutation({
  args: {
    id: v.id("boards"),
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateBoard.safeParseAsync({
      title: args.title,
    });

    if (!result.success) {
      throw new Error("Invalid input data");
    }

    const existingBoard = await ctx.db.get(args.id);
    if (!existingBoard) {
      throw new Error("Not found");
    }

    if (existingBoard.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    id: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingBoard = await ctx.db.get(args.id);
    if (!existingBoard) {
      throw new Error("Not found");
    }

    if (existingBoard.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.delete(args.id);

    return board;
  },
});
