import { z } from "zod";

export const CreateComment = z.object({
  comment: z
    .string({
      required_error: "Comment is required",
      invalid_type_error: "Comment is required",
    })
    .min(1, {
      message: "Comment is too short",
    })
    .max(500, {
      message: "Comment is too long",
    }),
  cardId: z.string({
    required_error: "Card Id is required",
    invalid_type_error: "Card Id is required",
  }),
});
