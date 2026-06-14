import { z } from "zod";
import { GoodInOrderSchema } from "../good/schema";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  orderId: z.coerce.number().int().positive(),
  goodId: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  qnt: z.coerce.number().int().positive(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OrderGoodInOrderSchema = Schema.pick({
  id: true,
  price: true,
  qnt: true,
}).extend({
  good: GoodInOrderSchema,
});
