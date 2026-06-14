import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z
    .string({
      required_error: "Название обязательно",
      invalid_type_error: "Название обязательно",
    })
    .trim()
    .min(1, {
      message: "Название обязательно",
    })
    .max(255, {
      message: "Название не может быть длиннее 255 символов",
    }),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const BaseSchema = Schema.pick({ id: true, title: true });

export type Suggestion = z.infer<typeof BaseSchema>;

export const AddSuggestionSchema = Schema.pick({ title: true });
export const EditSuggestionSchema = Schema.pick({ title: true });
