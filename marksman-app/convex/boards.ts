import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { CreateBoard, UpdateBoard } from "../schemas/board-schemas";
import { MAX_BOARDS } from "../constants/max-boards";
import { DATE_IN_MS } from "../constants/day-in-ms";

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

    const hasAvailableCount = async (): Promise<boolean> => {
      const orgLimit = await ctx.db
        .query("orgLimits")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .first();

      if (!orgLimit || orgLimit?.count < MAX_BOARDS) {
        return true;
      }

      return false;
    };

    const isPro = async () => {
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .first();

      if (!subscription) {
        return false;
      }

      const isValid =
        subscription?.stripePriceId &&
        subscription?.stripeCurrentPeriodEnd! + DATE_IN_MS > Date.now();

      return !!isValid;
    };

    const incrementAvailableCount = async () => {
      const orgLimit = await ctx.db
        .query("orgLimits")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .first();

      if (orgLimit) {
        await ctx.db.patch(orgLimit._id, {
          count: orgLimit.count + 1,
        });
      } else {
        await ctx.db.insert("orgLimits", {
          orgId: args.orgId,
          count: 1,
        });
      }
    };

    const pro = await isPro();
    const canCreate = await hasAvailableCount();

    if (!canCreate && !pro) {
      throw new Error("Reached limit of free boards.");
    }

    const board = await ctx.db.insert("boards", {
      title: args.title,
      imageId,
      imageFullUrl,
      imageLinkHTML,
      imageThumbUrl,
      orgId: args.orgId,
      activeRecording: false,
    });

    await incrementAvailableCount();

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

    const isPro = async () => {
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .first();

      if (!subscription) {
        return false;
      }

      const isValid =
        subscription?.stripePriceId &&
        subscription?.stripeCurrentPeriodEnd! + DATE_IN_MS > Date.now();

      return !!isValid;
    };

    const decreaseAvailableCount = async () => {
      const orgLimit = await ctx.db
        .query("orgLimits")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .first();

      if (orgLimit) {
        await ctx.db.patch(orgLimit._id, {
          count: orgLimit.count > 0 ? orgLimit.count - 1 : 0,
        });
      } else {
        await ctx.db.insert("orgLimits", {
          orgId: args.orgId,
          count: 1,
        });
      }
    };

    const board = await ctx.db.delete(args.id);

    const pro = await isPro();

    if (!pro) {
      await decreaseAvailableCount();
    }

    return board;
  },
});

export const updateAnynomous = mutation({
  args: {
    id: v.id("boards"),
    activeRecording: v.boolean(),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Not found");
    }

    const updatedBoard = await ctx.db.patch(args.id, {
      activeRecording: args.activeRecording,
    });

    return updatedBoard;
  },
});
