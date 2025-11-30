import { z } from "zod";
import { stringField } from "./commonSchema";

export const BaseModelSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
});

export const ListQuerySchema = z.object({
  page: stringField("page")
    .optional()
    .default("1")
    .refine((val) => !!(val && !isNaN(Number(val))), {
      message: "page must be a number",
    }),
  limit: stringField("limit")
    .optional()
    .default("10")
    .refine((val) => !!(val && !isNaN(Number(val))), {
      message: "page size must be a number",
    }),
  search: stringField("Search", 0).optional(),
});
