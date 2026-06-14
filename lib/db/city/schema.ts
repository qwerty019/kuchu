import { z } from "zod";
import { BranchInCitySchema } from "../branch/schema";
import { DeliveryZoneInCitySchema } from "../deliveryzone/schema";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1, { message: "Название обязательно" }).max(255),
  route: z.string().min(1, { message: "Маршрут обязательно" }).max(255),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddCitySchema = Schema.pick({
  title: true,
  route: true,
});

export const EditCitySchema = Schema.pick({
  title: true,
  route: true,
});

const BaseSchema = Schema.pick({
  id: true,
  title: true,
  route: true,
});

export const CityWithBranchesAndZonesSchema = BaseSchema.extend({
  branches: z.array(
    BranchInCitySchema.extend({
      goodCount: z.number(),
      _count: z.object({
        osts: z.number(),
      }),
    })
  ),
  zones: z.array(DeliveryZoneInCitySchema),
});

export type CityWithBranchesAndZones = z.infer<
  typeof CityWithBranchesAndZonesSchema
>;
