import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  goodId: z.coerce.number().int().positive(),
  title: z.string().min(1, { message: "Название обязательно" }),
  content: z.string().min(1, { message: "Контент обязателен" }),
  text: z.string().min(1, { message: "Текст обязателен" }),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddContentSchema = Schema.pick({
  goodId: true,
  title: true,
  content: true,
});

export const EditContentSchema = Schema.pick({
  title: true,
  content: true,
});

const BaseSchema = Schema.pick({
  id: true,
  title: true,
  content: true,
});

export type Content = z.infer<typeof BaseSchema>;
