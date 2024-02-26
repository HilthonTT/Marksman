import { v } from "convex/values";

import { mutation } from "./_generated/server";

import { CreateComment } from "../schemas/comment-schemas";

export const create = mutation({
  args: {
    cardId: v.id("cards"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateComment.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const userId = identity.subject;

    const comment = await ctx.db.insert("comments", {
      userId,
      comment: args.comment,
      card: args.cardId,
    });

    const fetchComment = await ctx.db.get(comment);

    return fetchComment;
  },
});
