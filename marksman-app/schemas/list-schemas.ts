import { z } from "zod";

export const UpdateList = z.object({
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id is required",
  }),
  boardId: z.string({
    required_error: "Board Id is required",
    invalid_type_error: "Board Id is required",
  }),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    })
    .max(50, {
      message: "Title is too long",
    }),
});

export const UpdateListOrder = z.object({
  items: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      order: z.number(),
    })
  ),
  boardId: z.string(),
});

export const CreateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short.",
    }),
});
