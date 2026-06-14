import { z } from "zod";
import { MessageBaseSchema } from "../apChatMessage/schema";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
  title: z
    .string({
      required_error: "Название обязательно",
      invalid_type_error: "Название обязательно",
    })
    .trim()
    .min(1, { message: "Название обязательно" }),
});

export const AddApChatSchema = Schema.pick({
  projectId: true,
  title: true,
});

export const EditApChatSchema = Schema.pick({
  title: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  title: true,
});

export type ApChat = z.infer<typeof BaseSchema>;

export const ApChatWithMessages = BaseSchema.extend({
  messages: z.array(MessageBaseSchema),
});

export type ApChatWithMessages = z.infer<typeof ApChatWithMessages>;
