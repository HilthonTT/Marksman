import { z } from "zod";

export const CreateEvent = z.object({
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
  start: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }),
  allDay: z.boolean({
    required_error: "All day is required",
    invalid_type_error: "All day is required",
  }),
  orgId: z.string({
    required_error: "Org Id is required",
    invalid_type_error: "Org Id is required",
  }),
});
