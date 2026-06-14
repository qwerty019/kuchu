import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  nominal: z.coerce.number().int().positive(),
  url: z.string().nullable(),
  title: z.string().nullable(),
  show: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BaseSchema = Schema.pick({
  id: true,
  nominal: true,
  url: true,
  title: true,
  show: true,
});

export type CertOption = z.infer<typeof BaseSchema>;

export const AddCertOptionSchema = Schema.pick({
  nominal: true,
  show: true,
});
