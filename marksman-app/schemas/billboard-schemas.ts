import { z } from "zod";

export const CreateBillboard = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }),
  orgId: z.string({
    required_error: "Organzation Id is required",
    invalid_type_error: "Organzation Id is required",
  }),
});
