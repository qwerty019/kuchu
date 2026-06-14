import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  orderId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  status: z.string().nullable(),
  ykId: z.string().nullable(),
  url: z.string().nullable(),
  token: z.string().nullable(),
  amount: z.coerce.number().nonnegative(),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddPaymentSchema = Schema.pick({
  orderId: true,
  userId: true,
  status: true,
  ykId: true,
  url: true,
  token: true,
  amount: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  orderId: true,
  userId: true,
  status: true,
  ykId: true,
  url: true,
  token: true,
});

export type Payment = z.infer<typeof BaseSchema>;

export const PaymentInOrderSchema = Schema.pick({
  id: true,
  amount: true,
  status: true,
  token: true,
  createdAt: true,
  updatedAt: true,
});

export const PaymentInCurrentOrderSchema = Schema.pick({
  status: true,
  token: true,
});
