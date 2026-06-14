import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  filterId: z.coerce.number().int().positive(),
  value: z
    .string({
      required_error: "Значение обязательно",
      invalid_type_error: "Значение обязательно",
    })
    .min(1, {
      message: "Значение обязательно",
    })
    .max(255, {
      message: "Значение не может быть длиннее 255 символов",
    }),
});

const BaseSchema = Schema.pick({ id: true, value: true });

export type FilterOption = z.infer<typeof BaseSchema>;

export const AddFilterOptionSchema = Schema.pick({
  value: true,
  filterId: true,
});
export const EditFilterOptionSchema = Schema.pick({ value: true });
