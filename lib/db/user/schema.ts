import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().trim().nullable(),
  surname: z.string().trim().nullable(),
  patronymic: z.string().trim().nullable(),
  avatar: z.string().trim().nullable(),
  dob: z.string().datetime().nullable(),
  phone: z.string().trim().nullable(),
  email: z.string().trim().nullable(),
  password: z.string().trim().nullable(),
  roles: z.array(z.string()).nullable(),
  branchId: z.coerce.number().int().positive().nullable(),
  method: z.string().trim().nullable(),
  applied: z.boolean().default(false),
  promo: z.boolean().default(false),
  share: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export const UserPreferencesSchema = Schema.pick({
  share: true,
  promo: true,
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const ExportedUserSchema = Schema.pick({
  id: true,
  phone: true,
  surname: true,
  name: true,
  patronymic: true,
  dob: true,
  applied: true,
});

export type ExportedUser = z.infer<typeof ExportedUserSchema>;

export const UserInAdminSchema = Schema.pick({
  id: true,
  phone: true,
  name: true,
  surname: true,
  patronymic: true,
  dob: true,
  applied: true,
  roles: true,
  createdAt: true,
}).extend({
  discountCards: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
      accumulation: z.coerce.number().int().positive(),
    })
  ),
});

export type UserInAdmin = z.infer<typeof UserInAdminSchema>;

export const UserInOrderSchema = Schema.pick({
  id: true,
  phone: true,
});
