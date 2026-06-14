import { z } from "zod";
import { UserInOrderSchema } from "../user/schema";
import { OrderGoodInOrderSchema } from "../orderGood/schema";
import { AddressInOrderSchema } from "../address/schema";
import { BranchInOrderSchema } from "../branch/schema";
import {
  PaymentInCurrentOrderSchema,
  PaymentInOrderSchema,
} from "../payment/schema";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  addressId: z.coerce.number().int().positive().nullable(),
  deliveryFee: z.coerce.number().nullable(),
  branchId: z.coerce.number().int().positive().nullable(),
  sum: z.coerce.number().positive(),
  allSum: z.coerce.number().positive(),
  deliveryTime: z.string().nullable(),
  paymentType: z.string(),
  status: z.string(),
  fbId: z.coerce.number().int().positive().nullable(),
  body: z.string().nullable(),
  version: z.coerce.number().int().positive().default(1),
  error: z.string().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddOrderSchema = Schema.pick({
  userId: true,
  addressId: true,
  deliveryFee: true,
  branchId: true,
  sum: true,
  allSum: true,
  deliveryTime: true,
  paymentType: true,
  fbId: true,
  body: true,
  version: true,
});

export const UserOrderSchema = Schema.pick({
  id: true,
  fbId: true,
  createdAt: true,
  allSum: true,
  status: true,
  deliveryFee: true,
  paymentType: true,
});

export const BaseSchema = Schema.pick({
  id: true,
  fbId: true,
  createdAt: true,
  updatedAt: true,
  allSum: true,
  status: true,
  deliveryFee: true,
  paymentType: true,
  isDeleted: true,
  body: true,
  version: true,
  error: true,
}).extend({
  user: UserInOrderSchema,
  orderGoods: z.array(OrderGoodInOrderSchema),
  address: AddressInOrderSchema.nullable(),
  branch: BranchInOrderSchema.nullable(),
  payments: z.array(PaymentInOrderSchema),
});

export type OrderAdmin = z.infer<typeof BaseSchema>;

export const CurrentOrderSchema = Schema.pick({
  id: true,
  fbId: true,
  status: true,
  sum: true,
  allSum: true,
  deliveryFee: true,
  deliveryTime: true,
  paymentType: true,
  createdAt: true,
  version: true,
}).extend({
  orderGoods: z.array(OrderGoodInOrderSchema),
  address: AddressInOrderSchema.nullable(),
  branch: BranchInOrderSchema.nullable(),
  payments: z.array(PaymentInCurrentOrderSchema),
});

export type CurrentOrder = z.infer<typeof CurrentOrderSchema>;
export type Order = z.infer<typeof CurrentOrderSchema>;
