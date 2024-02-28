import { z } from "zod";

export const CreateEventForm = z.object({
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

export const CreateEvent = z.object({
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
  start: z.number({
    required_error: "Start is required",
    invalid_type_error: "Start is required",
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

export const UpdateEvent = z.object({
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id is required",
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
  description: z.optional(
    z.string().max(500, {
      message: "Description is too long",
    })
  ),
  start: z.number({
    required_error: "Start is required",
    invalid_type_error: "Start is required",
  }),
});
