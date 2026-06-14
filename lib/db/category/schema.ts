import { z } from "zod";
import { Good } from "../good/definitions";

const Schema = z.object({
  id: z.coerce.number(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Название обязательно" })
    .max(255, { message: "Название слишком длинное" }),
  route: z.string().trim().min(1).max(255),
  position: z.coerce.number().int().nullable(),
  url: z.string().url().nullable(),
  parentId: z.coerce.number().int().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddCategorySchema = Schema.pick({
  title: true,
  parentId: true,
});

export const EditCategorySchema = Schema.pick({
  title: true,
  parentId: true,
  url: true,
});

const CategoryLeftSideSchema = Schema.pick({
  id: true,
  title: true,
  route: true,
  url: true,
}).extend({
  children: z.array(
    Schema.pick({
      id: true,
      title: true,
      route: true,
    })
  ),
});

export type CategoryLeftSide = z.infer<typeof CategoryLeftSideSchema>;

const BaseCategorySchema = Schema.pick({
  id: true,
  title: true,
  route: true,
});

type BaseCategory = z.infer<typeof BaseCategorySchema>;

export type CategoryForPage = BaseCategory & {
  goods: Good[];
  children: (BaseCategory & { goods: Good[] })[];
};

const CategorySchema = BaseCategorySchema.omit({
  route: true,
}).extend({
  position: z.coerce.number().nullable(),
  url: z.string().url().nullable(),
  parent: z
    .object({
      id: z.coerce.number(),
      title: z.string(),
    })
    .nullable(),
  _count: z.object({
    children: z.coerce.number(),
  }),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoryInEditSchema = Schema.pick({
  title: true,
  parentId: true,
  url: true,
});

export type CategoryInEdit = z.infer<typeof CategoryInEditSchema>;

export const NestedCategorySchema = Schema.pick({
  id: true,
  title: true,
  route: true,
}).extend({
  collapsed: z.boolean().default(false),
});

export type NestedCategory = z.infer<typeof NestedCategorySchema> & {
  children: NestedCategory[];
};
