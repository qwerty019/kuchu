import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
  title: z.string().trim().min(1, { message: "Название обязательно" }),
  content: z.string().trim().min(1, { message: "Контент обязателен" }),
  embeddings: z.array(z.number()).optional(),
});

export const AddApKnowledgeSchema = Schema.pick({
  projectId: true,
  title: true,
  content: true,
});

export const EditApKnowledgeSchema = Schema.pick({
  title: true,
  content: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  title: true,
  content: true,
});

export type ApKnowledge = z.infer<typeof BaseSchema>;
