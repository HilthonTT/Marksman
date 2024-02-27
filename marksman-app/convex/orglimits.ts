import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { MAX_BOARDS } from "../constants/max-boards";

export const getAvailableCount = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const orgLimit = await ctx.db
      .query("orgLimits")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    if (!orgLimit) {
      return 0;
    }

    return orgLimit.count;
  },
});

export const incrementAvailableCount = mutation({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

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
  },
});

export const decreaseAvailableCount = mutation({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

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
  },
});

export const hasAvailableCount = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const orgLimit = await ctx.db
      .query("orgLimits")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    if (!orgLimit || orgLimit?.count < MAX_BOARDS) {
      return true;
    }

    return false;
  },
});
