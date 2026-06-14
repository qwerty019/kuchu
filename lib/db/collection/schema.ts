import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Название обязательно" })
    .max(255, { message: "Название слишком длинное" }),
  img: z.string().url().nullable(),
  position: z.coerce.number().int().positive().nullable(),
  show: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddCollectionSchema = Schema.pick({
  title: true,
  position: true,
  show: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  title: true,
  show: true,
  position: true,
}).extend({
  count: z.coerce.number(),
});

export type Collection = z.infer<typeof BaseSchema>;

export const CollectionWithGoodsSchema = Schema.pick({
  id: true,
  title: true,
}).extend({
  collgoods: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
      good: z.object({
        id: z.coerce.number().int().positive(),
        drug: z.string(),
        form: z.string(),
        category: z
          .object({
            id: z.coerce.number().int().positive(),
            title: z.string(),
          })
          .nullable(),
      }),
    })
  ),
});

export type CollectionWithGoods = z.infer<typeof CollectionWithGoodsSchema>;
