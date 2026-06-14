import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  query: z
    .string({
      required_error: "Запрос не может быть пустым",
      invalid_type_error: "Запрос не может быть пустым",
    })
    .trim()
    .min(1, "Запрос не может быть пустым")
    .max(255),
  list: z
    .array(
      z
        .string({
          required_error: "Исключение не может быть пустым",
          invalid_type_error: "Исключение не может быть пустым",
        })
        .trim()
        .min(1, "Исключение не может быть пустым")
        .max(255)
    )
    .min(1, "Список исключений не может быть пустым"),
});

export const AddSearchExclusionSchema = Schema.pick({
  query: true,
  list: true,
});

export const EditSearchExclusionSchema = Schema.pick({
  query: true,
  list: true,
});

export type SearchExclusion = z.infer<typeof Schema>;
