import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { CreateItem, UpdateItem } from "../schemas/item-schemas";

export const getAll = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const items = await ctx.db
      .query("items")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    let totalQuantity = 0;
    let totalPrice = 0;

    for (const item of items) {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * (item.price || 0);
    }

    return { items, totalQuantity, totalPrice };
  },
});

export const getById = query({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const item = await ctx.db.get(args.id);

    if (!item) {
      throw new Error("Not found");
    }

    return item;
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    quantity: v.number(),
    minLevel: v.optional(v.number()),
    price: v.optional(v.float64()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateItem.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const item = await ctx.db.insert("items", {
      ...args,
    });

    return item;
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.string(),
    quantity: v.number(),
    minLevel: v.optional(v.number()),
    price: v.optional(v.float64()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateItem.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const item = await ctx.db.get(args.id);

    if (!item) {
      throw new Error("Not found");
    }

    const updatedItem = await ctx.db.patch(args.id, {
      ...args,
    });

    return updatedItem;
  },
});

export const remove = mutation({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const item = await ctx.db.delete(args.id);

    return item;
  },
});
