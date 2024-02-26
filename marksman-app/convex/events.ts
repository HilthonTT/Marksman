import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { CreateEvent, UpdateEvent } from "../schemas/event-schemas";

export const getAll = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const events = await ctx.db
      .query("events")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    return events;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    start: v.number(),
    allDay: v.boolean(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await CreateEvent.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const event = await ctx.db.insert("events", {
      orgId: args.orgId,
      title: args.title,
      allDay: args.allDay,
      start: args.start,
    });

    return event;
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    description: v.optional(v.string()),
    start: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const result = await UpdateEvent.safeParseAsync(args);
    if (!result.success) {
      throw new Error("Invalid data input");
    }

    const event = await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      start: args.start,
    });

    return event;
  },
});

export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const event = await ctx.db.get(args.id);
    if (!event) {
      throw new Error("Not found");
    }

    const deletedEvent = await ctx.db.delete(args.id);

    return deletedEvent;
  },
});
