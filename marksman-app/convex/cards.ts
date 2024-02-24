import { v } from "convex/values";

import { mutation } from "./_generated/server";

import {
  CreateCard,
  UpdateCard,
  UpdateCardOrder,
} from "../schemas/card-schemas";

export const update = mutation({
  args: {
    id: v.id("cards"),
    title: v.string(),
    description: v.optional(v.string()),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateCard.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const list = await ctx.db.get(args.id);
    if (!list) {
      throw new Error("Not found");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Not found");
    }

    const updatedList = await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description ? args.description : list.description,
    });

    return updatedList;
  },
});

export const updateOrder = mutation({
  args: {
    items: v.array(
      v.object({
        _id: v.id("cards"),
        title: v.string(),
        order: v.number(),
        list: v.id("lists"),
      })
    ),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateCardOrder.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Not found");
    }

    for (const card of args.items) {
      await ctx.db.patch(card._id, {
        order: card.order,
        list: card.list,
      });
    }
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    listId: v.id("lists"),
    boardId: v.id("boards"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateCard.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid input data");
    }

    const lastCard = await ctx.db
      .query("cards")
      .withIndex("by_list", (q) => q.eq("list", args.listId))
      .order("desc")
      .first();

    const newOrder = lastCard ? lastCard?.order + 1 : 1;

    const card = await ctx.db.insert("cards", {
      title: args.title,
      list: args.listId,
      description: args.description,
      order: newOrder,
    });

    return card;
  },
});
