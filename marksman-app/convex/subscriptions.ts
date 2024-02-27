import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { DATE_IN_MS } from "../constants/day-in-ms";

export const check = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return false;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    if (!subscription) {
      return false;
    }

    const isValid =
      subscription?.stripePriceId &&
      subscription?.stripeCurrentPeriodEnd! + DATE_IN_MS > Date.now();

    return !!isValid;
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    stripeCustomerId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db.insert("subscriptions", {
      orgId: args.orgId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripeCustomerId: args.stripeCustomerId,
      stripePriceId: args.stripePriceId,
      stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
    });

    return subscription;
  },
});

export const update = mutation({
  args: {
    stripeCurrentPeriodEnd: v.number(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) =>
        q.eq(q.field("stripeCustomerId"), args.stripeSubscriptionId)
      )
      .first();

    if (!subscription) {
      throw new Error("Not found");
    }

    const updatedSubcription = await ctx.db.patch(subscription._id, {
      stripePriceId: args.stripePriceId,
      stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
    });

    return updatedSubcription;
  },
});

export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    return subscription;
  },
});
