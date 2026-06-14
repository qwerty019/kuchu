import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  chatId: z.coerce.number().int().positive(),
  role: z.string().trim().min(1, { message: "Роль обязательна" }),
  content: z.string().trim().min(1, { message: "Контент обязателен" }),
  inputTokens: z.number().nullable(),
  outputTokens: z.number().nullable(),
  price: z.number().nullable(),
  usedContext: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const AddApChatMessageSchema = Schema.pick({
  chatId: true,
  role: true,
  content: true,
  inputTokens: true,
  outputTokens: true,
  price: true,
  usedContext: true,
});

export const EditApChatMessageSchema = Schema.pick({
  role: true,
  content: true,
  inputTokens: true,
  outputTokens: true,
  price: true,
  usedContext: true,
});

export const MessageBaseSchema = Schema.pick({
  id: true,
  role: true,
  content: true,
  createdAt: true,
  price: true,
  inputTokens: true,
  outputTokens: true,
  usedContext: true,
});

export type ApChatMessage = z.infer<typeof MessageBaseSchema>;
