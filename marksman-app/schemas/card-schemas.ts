import { z } from "zod";

export const UpdateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short.",
    })
    .max(50, {
      message: "Title is too long",
    }),

  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
      })
      .min(3, {
        message: "Description is too short",
      })
  ),
  id: z.string(),
  boardId: z.string(),
});

export const UpdateCardOrder = z.object({
  items: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      order: z.number(),
      list: z.string(),
    })
  ),
  boardId: z.string(),
});

export const CreateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short.",
    }),
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
      })
      .min(3, {
        message: "Description is too short",
      })
  ),
  boardId: z.string(),
  listId: z.string(),
});
