import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import {
  CreateList,
  UpdateList,
  UpdateListOrder,
} from "../schemas/list-schemas";

export const getByBoardId = query({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const lists = await ctx.db
      .query("lists")
      .withIndex("by_board", (q) => q.eq("board", args.boardId))
      .collect();

    // Fetch cards associated with each list
    const listsWithCards = await Promise.all(
      lists.map(async (list) => {
        const cards = await ctx.db
          .query("cards")
          .withIndex("by_list", (q) => q.eq("list", list._id))
          .collect();

        // Fetch comments associated with each card
        const cardsWithComments = await Promise.all(
          cards.map(async (card) => {
            const comments = await ctx.db
              .query("comments")
              .withIndex("by_card", (q) => q.eq("card", card._id))
              .collect();
            return { ...card, comments };
          })
        );

        return { ...list, cards: cardsWithComments };
      })
    );

    listsWithCards.sort((a, b) => a.order - b.order);

    // Sort cards inside each list by their order field
    listsWithCards.forEach((list) => {
      list.cards.sort((a, b) => a.order - b.order);
    });

    return listsWithCards;
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateList.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Not found");
    }

    if (board.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }

    const lastList = await ctx.db
      .query("lists")
      .withIndex("by_board", (q) => q.eq("board", args.boardId))
      .order("desc")
      .first();

    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await ctx.db.insert("lists", {
      title: args.title,
      order: newOrder,
      board: board._id,
    });

    return list;
  },
});

export const update = mutation({
  args: {
    title: v.string(),
    boardId: v.id("boards"),
    id: v.id("lists"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateList.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid input data");
    }

    const list = await ctx.db.get(args.id);
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

    const updatedList = await ctx.db.patch(list._id, {
      title: args.title,
    });

    return updatedList;
  },
});

export const updateOrder = mutation({
  args: {
    items: v.array(
      v.object({
        _id: v.id("lists"),
        title: v.string(),
        order: v.number(),
      })
    ),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateListOrder.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Not found");
    }

    for (const list of args.items) {
      await ctx.db.patch(list._id, {
        order: list.order,
      });
    }
  },
});

export const remove = mutation({
  args: {
    orgId: v.string(),
    id: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const list = await ctx.db.get(args.id);
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

    const deletedBoard = await ctx.db.delete(args.id);

    return deletedBoard;
  },
});

export const copy = mutation({
  args: {
    orgId: v.string(),
    id: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const listToCopy = await ctx.db.get(args.id);
    if (!listToCopy) {
      throw new Error("Not found");
    }

    const board = await ctx.db.get(listToCopy.board);
    if (!board) {
      throw new Error("Not found");
    }

    if (board.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }

    const lastList = await ctx.db
      .query("lists")
      .withIndex("by_board", (q) => q.eq("board", listToCopy.board))
      .order("desc")
      .first();

    const newOrder = lastList ? lastList.order + 1 : 1;

    const copiedList = await ctx.db.insert("lists", {
      board: listToCopy.board,
      order: newOrder,
      title: `${listToCopy.title} - Copy`,
    });

    const cards = await ctx.db
      .query("cards")
      .withIndex("by_list", (q) => q.eq("list", listToCopy._id))
      .collect();

    for (const card of cards) {
      await ctx.db.insert("cards", {
        list: copiedList,
        title: card.title,
        description: card.description,
        order: card.order,
      });
    }
  },
});
