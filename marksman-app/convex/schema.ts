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

  billboards: defineTable({
    title: v.string(),
    orgId: v.string(),
  }).index("by_org", ["orgId"]),

  categories: defineTable({
    title: v.string(),
    billboard: v.id("billboards"),
  }).index("by_billboard", ["billboard"]),

  items: defineTable({
    name: v.string(),
    quantity: v.number(),
    category: v.id("categories"),
  }).index("by_category", ["category"]),

  itemImages: defineTable({
    item: v.id("items"),
    url: v.string(),
  }).index("by_item", ["item"]),
});
