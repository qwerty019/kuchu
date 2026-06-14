import { z } from "zod";

export const Schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Название обязательно",
    })
    .max(255, {
      message: "Название слишком длинное",
    }),
  img: z
    .string()
    .trim()
    .min(1, {
      message: "Изображение обязательно",
    })
    .url({
      message: "Неверный формат ссылки",
    }),
  position: z.coerce.number().int().nullable(),
  show: z.boolean().default(true),
  completed: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddStorySchema = Schema.pick({
  title: true,
  img: true,
  position: true,
  show: true,
  completed: true,
})
  .extend({
    storybranches: z.array(z.coerce.number().int().positive()).min(1, {
      message: "Выберите хотя бы один филиал",
    }),
    slides: z
      .array(
        z.object({
          img: z
            .string()
            .trim()
            .min(1, { message: "Изображение обязательно" })
            .url({ message: "Неверный формат ссылки" }),
          title: z
            .string()
            .trim()
            .min(1, { message: "Текст обязателен" })
            .max(255, { message: "Слишком длинное название" }),
          subtitle: z.string().trim().nullable(),
          text: z.string().trim().min(1, { message: "Текст обязателен" }),
          categoryId: z.coerce.number().int().positive().nullable(),
          link: z
            .string()
            .trim()
            .url({ message: "Неверный формат ссылки" })
            .nullable(),
          button: z.string().trim().nullable(),
        })
      )
      .min(1, { message: "Добавьте хотя бы один слайд" }),
  })
  .superRefine((data, ctx) => {
    data.slides.forEach((s, index) => {
      if (s.categoryId && s.link) {
        ctx.addIssue({
          code: "custom",
          message: "Выберите категорию или введите ссылку",
          path: ["slides", index, "link"],
        });
      }
      if (!s.categoryId && !s.link && s.button) {
        ctx.addIssue({
          code: "custom",
          message: "Это поле не нужно, если нет ссылки или категории",
          path: ["slides", index, "button"],
        });
      }
    });
  });

export const StoryInEditSchema = Schema.pick({
  id: true,
  title: true,
  img: true,
  position: true,
  show: true,
  completed: true,
}).extend({
  storybranches: z.array(z.coerce.number().int().positive()),
  slides: z.array(
    z.object({
      img: z.string(),
      title: z.string(),
      subtitle: z.string().nullable(),
      text: z.string(),
      categoryId: z.coerce.number().int().positive().nullable(),
      link: z.string().nullable(),
      button: z.string().nullable(),
    })
  ),
});

export type StoryInEdit = z.infer<typeof StoryInEditSchema>;

export const StoryAdminSchema = Schema.pick({
  id: true,
  title: true,
  img: true,
});

export type StoryAdmin = z.infer<typeof StoryAdminSchema>;
