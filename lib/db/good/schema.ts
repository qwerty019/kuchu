import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive().nullable(),
  regId: z.coerce.number().int().positive(),
  drugId: z.coerce.number().int().positive(),
  formId: z.coerce.number().int().positive(),
  fabrId: z.coerce.number().int().positive(),
  mnnId: z.coerce.number().int().positive(),
  drug: z.string(),
  form: z.string(),
  fabr: z.string(),
  mnn: z.string(),
  flag: z.coerce.number().int().positive(),
  ean: z.string(),
  isVital: z.boolean(),
  isService: z.boolean(),
  rSum: z.coerce.number(),
  torgname: z.string().nullable(),
  formoutput: z.string().nullable(),
  img: z.string().trim().nullable(),
  fullName: z.string().nullable(),
  descId: z.coerce.number().int().positive().nullable(),
  imported: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isHidden: z.boolean(),
  title: z.string().trim().nullable(),
  subtitle: z.string().trim().nullable(),
});

export const EditGoodSchema = Schema.pick({
  categoryId: true,
  img: true,
  isHidden: true,
  title: true,
  subtitle: true,
});

export const BaseGoodSchema = Schema.pick({
  id: true,
  regId: true,
  drug: true,
  form: true,
  img: true,
  title: true,
  subtitle: true,
}).extend({
  category: z
    .object({
      id: z.coerce.number().int().positive(),
      title: z.string(),
    })
    .nullable(),
});

export type Good = z.infer<typeof BaseGoodSchema>;

const GoodWithContentsSchema = Schema.pick({
  id: true,
  imported: true,
}).extend({
  contents: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
      title: z.string(),
      content: z.string(),
    })
  ),
});

export type GoodWithContents = z.infer<typeof GoodWithContentsSchema>;

const GoodWithFiltersSchema = Schema.pick({
  id: true,
}).extend({
  filters: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
      option: z.object({
        id: z.coerce.number().int().positive(),
        value: z.string(),
        filter: z.object({
          title: z.string(),
        }),
      }),
    })
  ),
});

export type GoodWithFilters = z.infer<typeof GoodWithFiltersSchema>;

export const GoodAdminSchema = Schema.pick({
  id: true,
  regId: true,
  drug: true,
  form: true,
  img: true,
  title: true,
  subtitle: true,
  isHidden: true,
  descId: true,
  ean: true,
  fabr: true,
}).extend({
  category: z
    .object({
      id: z.coerce.number().int().positive(),
      title: z.string(),
    })
    .nullable(),
});

export type GoodAdmin = z.infer<typeof GoodAdminSchema>;

export const GoodInOrderSchema = Schema.pick({
  regId: true,
  drug: true,
  form: true,
  img: true,
  title: true,
  subtitle: true,
});
