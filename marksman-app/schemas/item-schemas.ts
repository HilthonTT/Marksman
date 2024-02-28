import { z } from "zod";

export const CreateItem = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .min(1, {
      message: "Name is too short",
    }),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity is required",
  }),
  minLevel: z.optional(z.number()),
  price: z.optional(z.number()),
  imageUrl: z.optional(z.string()),
  orgId: z.string({
    required_error: "Org Id is required",
    invalid_type_error: "Org Id is required",
  }),
});

export const UpdateItem = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name is required",
  }),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity is required",
  }),
  minLevel: z.optional(z.number()),
  price: z.optional(z.number()),
  imageUrl: z.optional(z.string()),
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id is required",
  }),
});
