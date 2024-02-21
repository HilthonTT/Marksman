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
  }),
});
