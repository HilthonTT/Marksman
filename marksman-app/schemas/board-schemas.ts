import { z } from "zod";

export const CreateBoard = z.object({
  image: z
    .string({
      required_error: "Image is required",
      invalid_type_error: "Image is required",
    })
    .min(1, {
      message: "Please select a valid image",
    }),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(1, {
      message: "Title is too short",
    })
    .max(100, {
      message: "Title is too long",
    }),
});

export const UpdateBoard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(1, {
      message: "Title is too short",
    })
    .max(100, {
      message: "Title is too long",
    }),
});
