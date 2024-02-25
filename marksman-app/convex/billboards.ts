import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { CreateBillboard } from "../schemas/billboard-schemas";

export const getAll = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const billboards = await ctx.db
      .query("billboards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    return billboards;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateBillboard.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const billboard = await ctx.db.insert("billboards", {
      title: args.title,
      orgId: args.orgId,
    });

    return billboard;
  },
});

export const remove = mutation({
  args: {
    id: v.id("billboards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const billboard = await ctx.db.get(args.id);
    if (!billboard) {
      throw new Error("Not found");
    }

    if (billboard.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }

    const deletedBillboard = await ctx.db.delete(args.id);

    return deletedBillboard;
  },
});
