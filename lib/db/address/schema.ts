import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  zoneId: z.coerce.number().int().positive().nullable(),
  userId: z.coerce.number().int().positive(),
  address: z
    .string()
    .trim()
    .min(1, { message: "Выберите адрес доставки" })
    .max(255, { message: "Адрес должен быть не более 255 символов." }),
  entrance: z.string().trim().min(1).max(255).nullable(),
  floor: z.string().trim().min(1).max(255).nullable(),
  apartment: z.string().trim().min(1).max(255).nullable(),
  comment: z.string().trim().min(1).max(255).nullable(),
  lat: z.coerce.number().nullable(),
  long: z.coerce.number().nullable(),
  price: z.coerce.number().nullable(),
  selected: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddAddressSchema = Schema.omit({
  id: true,
  userId: true,
  price: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  search: z
    .string()
    .trim()
    .min(1, { message: "Выберите адрес доставки" })
    .max(255, { message: "Адрес должен быть не более 255 символов" })
    .optional(),
});

export const AddressSchema = Schema.pick({
  id: true,
  address: true,
  entrance: true,
  floor: true,
  apartment: true,
  comment: true,
  lat: true,
  long: true,
  selected: true,
  zoneId: true,
});

export type Address = z.infer<typeof AddressSchema>;

export const AddressInOrderSchema = Schema.pick({
  address: true,
  entrance: true,
  floor: true,
  apartment: true,
  comment: true,
});
