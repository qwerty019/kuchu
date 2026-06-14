import { z } from "zod";
import { FilterOption } from "../filterOption/schema";

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
  type: z
    .string({
      required_error: "Тип обязателен",
      invalid_type_error: "Тип обязателен",
    })
    .trim()
    .regex(
      /^[a-z]+$/,
      "Тип должен содержать только латинские буквы с нижним регистром."
    )
    .min(1)
    .max(255),
});

export type Filter = z.infer<typeof Schema>;

export const AddFilterSchema = Schema.pick({ title: true, type: true });
export const EditFilterSchema = Schema.pick({ title: true, type: true });

export type FilterWithOptions = Filter & { options: FilterOption[] };
