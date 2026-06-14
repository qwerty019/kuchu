import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  phone: z.string().min(1, { message: "Телефон обязателен" }),
  callId: z.string().min(1, { message: "ID звонка обязателен" }),
  code: z.string().min(1, { message: "Код обязателен" }),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddCallSchema = Schema.pick({
  phone: true,
  callId: true,
  code: true,
});

export const EditCallSchema = Schema.pick({
  phone: true,
  callId: true,
  code: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  phone: true,
  callId: true,
  code: true,
});

export type Call = z.infer<typeof BaseSchema>;
