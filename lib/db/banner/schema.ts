import { z } from "zod";

const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, "Название обязательно")
    .max(255, "Название должно быть не более 255 символов"),
  img: z
    .string()
    .trim()
    .min(1, "Изображение обязательно")
    .url("Неверный URL изображения"),
  subtitle: z.string().trim().nullable(),
  position: z.coerce.number().int().nullable(),
  show: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export const AddBannerSchema = Schema.pick({
  title: true,
  img: true,
  subtitle: true,
  position: true,
  show: true,
}).extend({
  bannerbranches: z.array(z.coerce.number().int().positive()).min(1),
});

export const BannerInEditSchema = Schema.pick({
  id: true,
  title: true,
  img: true,
  subtitle: true,
  position: true,
  show: true,
}).extend({
  bannerbranches: z.array(z.coerce.number().int().positive()),
});

export type BannerInEdit = z.infer<typeof BannerInEditSchema>;

export const BaseSchema = Schema.pick({
  id: true,
  title: true,
  img: true,
  subtitle: true,
});

export type Banner = z.infer<typeof BaseSchema>;

export const PageBannerSchema = Schema.pick({
  id: true,
  title: true,
  img: true,
  subtitle: true,
  position: true,
  show: true,
});

export type PageBanner = z.infer<typeof PageBannerSchema>;
