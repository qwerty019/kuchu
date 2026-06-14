import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Название обязательно" })
    .max(255, { message: "Название слишком длинное" }),
  subtitle: z.string().trim().nullable(),
  text: z.string().trim().nullable(),
  img: z.string().url({ message: "Неверный формат ссылки" }),
  position: z.coerce.number().int().nullable(),
  images: z
    .array(z.string().url({ message: "Неверный формат ссылки" }))
    .nullable(),
  categoryId: z.coerce.number().int().positive().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  show: z.boolean(),
  selected: z.boolean(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddSaleSchema = Schema.pick({
  title: true,
  subtitle: true,
  text: true,
  img: true,
  position: true,
  images: true,
  categoryId: true,
  show: true,
  selected: true,
})
  .extend({
    salebranches: z
      .array(z.coerce.number().int().positive())
      .min(1, { message: "Выберите хотя бы один филиал" }),
    salegoods: z.array(z.coerce.number().int().positive()).nullable(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.categoryId && data.salegoods && data.salegoods.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "Выберите категорию или товары",
        path: ["categoryId"],
      });
    }

    if (!data.categoryId && data.salegoods?.length === 0 && !data.text) {
      ctx.addIssue({
        code: "custom",
        message: "Выберите категорию или товары или текст",
        path: ["text"],
      });
    }

    if (!data.images || data.images.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Добавьте хотя бы одно фото",
        path: ["images"],
      });
    }
  });

export const SaleAdminSchema = Schema.pick({
  id: true,
  title: true,
  img: true,
});

export type SaleAdmin = z.infer<typeof SaleAdminSchema>;

export const SaleInEditSchema = Schema.pick({
  id: true,
  title: true,
  subtitle: true,
  text: true,
  img: true,
  position: true,
  images: true,
  categoryId: true,
  startDate: true,
  endDate: true,
  show: true,
  selected: true,
}).extend({
  salebranches: z.array(z.coerce.number().int().positive()),
  salegoods: z.array(z.coerce.number().int().positive()).nullable(),
});

export type SaleInEdit = z.infer<typeof SaleInEditSchema>;
