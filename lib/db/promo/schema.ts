import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  code: z
    .string()
    .trim()
    .min(1, { message: "Код обязателен" })
    .max(255, { message: "Код слишком длинный" }),
  amount: z.coerce.number().positive().nullable(),
  percent: z.coerce.number().positive().nullable(),
  forFirstOrder: z.boolean().default(false),
  completed: z.boolean().default(false),
});

export const AddPromoSchema = Schema.pick({
  code: true,
  amount: true,
  percent: true,
  forFirstOrder: true,
  completed: true,
}).superRefine((data, ctx) => {
  if (!data.amount && !data.percent) {
    ctx.addIssue({
      code: "custom",
      message: "Сумма или процент обязательны",
      path: ["percent"],
    });
  }

  if (data.amount && data.percent) {
    ctx.addIssue({
      code: "custom",
      message: "Сумма и процент не могут быть одновременно заполнены",
      path: ["percent"],
    });
  }
});

export const BasePromoSchema = Schema.pick({
  id: true,
  code: true,
}).extend({
  orderpromos: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
    })
  ),
});

export type Promo = z.infer<typeof BasePromoSchema>;

export const PromoInEditSchema = Schema.pick({
  id: true,
  code: true,
  amount: true,
  percent: true,
  forFirstOrder: true,
  completed: true,
});

export type PromoInEdit = z.infer<typeof PromoInEditSchema>;
