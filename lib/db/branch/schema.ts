import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  cityId: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(255),
  address: z.string().trim().min(1).max(255).nullable(),
  fbId: z.coerce.number().int().nullable(),
  lat: z.coerce.number().nullable(),
  long: z.coerce.number().nullable(),
  main: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddBranchSchema = Schema.pick({
  cityId: true,
  title: true,
  address: true,
  fbId: true,
  lat: true,
  long: true,
  main: true,
});

export const EditBranchSchema = Schema.pick({
  title: true,
  address: true,
  fbId: true,
  lat: true,
  long: true,
  main: true,
});

const BaseSchema = Schema.pick({
  id: true,
  title: true,
  address: true,
  fbId: true,
  lat: true,
  long: true,
  main: true,
});

export type Branch = z.infer<typeof BaseSchema>;

export const BranchInCitySchema = Schema.pick({
  id: true,
  title: true,
  address: true,
  fbId: true,
  lat: true,
  long: true,
  main: true,
});

export type BranchInCity = z.infer<typeof BranchInCitySchema>;

const BranchWithCitySchema = BaseSchema.extend({
  city: z.object({
    id: z.coerce.number().int().positive(),
    title: z.string().trim().min(1).max(255),
  }),
});

export type BranchWithCity = z.infer<typeof BranchWithCitySchema>;

export const BranchInOrderSchema = Schema.pick({
  title: true,
  address: true,
});
