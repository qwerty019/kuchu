import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  query: z.string().trim().min(1).max(255),
  userId: z.coerce.number().int().positive().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SearchSchema = Schema.pick({
  id: true,
  query: true,
  createdAt: true,
}).extend({
  user: z
    .object({
      id: z.coerce.number().int().positive(),
      name: z.string().nullable(),
      surname: z.string().nullable(),
      phone: z.string().nullable(),
    })
    .nullable(),
});

export type Search = z.infer<typeof SearchSchema>;
