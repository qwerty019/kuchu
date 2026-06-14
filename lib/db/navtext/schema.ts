import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  text: z.string().trim().min(1, "Текст обязательно"),
  show: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddNavTextSchema = Schema.pick({
  text: true,
  show: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  text: true,
  show: true,
});

export type NavText = z.infer<typeof BaseSchema>;
