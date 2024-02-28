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
    activeRecording: v.boolean(),
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

  events: defineTable({
    orgId: v.string(),
    title: v.string(),
    start: v.number(),
    description: v.optional(v.string()),
    allDay: v.boolean(),
  }).index("by_org", ["orgId"]),

  subscriptions: defineTable({
    orgId: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
  }).index("by_org", ["orgId"]),

  orgLimits: defineTable({
    orgId: v.string(),
    count: v.number(),
  }).index("by_org", ["orgId"]),

  items: defineTable({
    orgId: v.string(),
    name: v.string(),
    quantity: v.number(),
    price: v.optional(v.float64()),
    minLevel: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
  }).index("by_org", ["orgId"]),
});
