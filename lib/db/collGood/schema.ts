import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  goodId: z.coerce.number().int().positive(),
  collectionId: z.coerce.number().int().positive(),
  position: z.coerce.number().int().positive().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddCategorySchema = z.object({
  collectionId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
});

export const AddGoodsSchema = z
  .object({
    collectionId: z.coerce.number().int().positive(),
    goods: z.array(z.coerce.number().int().positive()),
  })
  .superRefine((data, ctx) => {
    if (data.goods.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Выберите хотя бы один товар",
        path: ["goods"],
      });
    }
  });
