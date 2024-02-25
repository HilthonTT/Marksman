import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    orgId: v.string(),
    title: v.string(),
    imageId: v.string(),
    imageThumbUrl: v.string(),
    imageFullUrl: v.string(),
    imageLinkHTML: v.string(),
  }).index("by_org", ["orgId"]),
  lists: defineTable({
    title: v.string(),
    order: v.number(),

    board: v.id("boards"),
  }).index("by_board", ["board"]),
  cards: defineTable({
    title: v.string(),
    order: v.number(),
    description: v.optional(v.string()),
    list: v.id("lists"),
  }).index("by_list", ["list"]),
  comments: defineTable({
    userId: v.string(),
    comment: v.string(),
    card: v.id("cards"),
  })
    .index("by_user", ["userId"])
    .index("by_card", ["card"]),
});
