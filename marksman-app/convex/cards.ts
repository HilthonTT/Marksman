import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import {
  CreateCard,
  UpdateCard,
  UpdateCardOrder,
} from "../schemas/card-schemas";

export const getById = query({
  args: {
    id: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const card = await ctx.db.get(args.id);
    if (!card) {
      throw new Error("Not found");
    }

    return card;
  },
});

export const copy = mutation({
  args: {
    id: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const cardToCopy = await ctx.db.get(args.id);
    if (!cardToCopy) {
      throw new Error("Not found");
    }

    const lastCard = await ctx.db
      .query("cards")
      .withIndex("by_list", (q) => q.eq("list", cardToCopy.list))
      .order("desc")
      .first();

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const copiedCard = await ctx.db.insert("cards", {
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      order: newOrder,
      list: cardToCopy.list,
    });

    return copiedCard;
  },
});

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

export const remove = mutation({
  args: {
    orgId: v.string(),
    id: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const card = await ctx.db.get(args.id);
    if (!card) {
      throw new Error("Not found");
    }

    const list = await ctx.db.get(card.list);
    if (!list) {
      throw new Error("Not found");
    }

    const board = await ctx.db.get(list.board);
    if (!board) {
      throw new Error("Not found");
    }

    if (board.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }

    const deletedCard = await ctx.db.delete(args.id);

    return deletedCard;
  },
});
