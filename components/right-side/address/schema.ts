import { z } from "zod";

export const formSchema = z.object({
  address: z
    .string()
    .min(1, { message: "Поле обязательно для заполнения" })
    .max(255, { message: "Адрес должен быть не более 255 символов." }),
  lat: z.coerce.number(),
  long: z.coerce.number(),
  zoneId: z.coerce.number(),
  entrance: getOptional(10),
  floor: getOptional(10),
  apartment: getOptional(10),
  comment: getOptional(50),
  search: getOptional(255),
});

function getOptional(value: number) {
  return z
    .string()
    .trim()
    .max(value, {
      message: `Кол-во символов не должно превышать ${value}.`,
    })
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined);
}
