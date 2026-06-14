import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  cityId: z.coerce.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Название обязательно" })
    .max(255, { message: "Название слишком длинное" }),
  price: z.coerce.number().nonnegative(),
  threshold: z.coerce.number().nonnegative(),
  freeDelivery: z.coerce.number().nonnegative(),
  polygon: z.string().min(1, { message: "Полигон обязателен" }),
  color: z
    .string()
    .trim()
    .min(1, { message: "Цвет обязателен" })
    .max(255, { message: "Цвет слишком длинный" }),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddZoneSchema = Schema.pick({
  cityId: true,
  title: true,
  price: true,
  polygon: true,
  threshold: true,
  freeDelivery: true,
  color: true,
});

export const EditZoneSchema = Schema.pick({
  title: true,
  price: true,
  threshold: true,
  freeDelivery: true,
  color: true,
});

const BaseZoneSchema = Schema.pick({
  id: true,
  title: true,
  price: true,
  threshold: true,
  freeDelivery: true,
  color: true,
  polygon: true,
});

export type DeliveryZone = z.infer<typeof BaseZoneSchema>;

export const DeliveryZoneInCitySchema = Schema.pick({
  id: true,
  title: true,
  price: true,
  threshold: true,
  freeDelivery: true,
  color: true,
});

export type DeliveryZoneInCity = z.infer<typeof DeliveryZoneInCitySchema>;
